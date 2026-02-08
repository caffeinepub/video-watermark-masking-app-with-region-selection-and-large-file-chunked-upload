import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import MixinStorage "blob-storage/Mixin";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import MixinAuthorization "authorization/MixinAuthorization";
import Migration "migration";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let accessSecret = "not_submitted_to_git";

  // Helper types
  type VideoId = Text;
  type WatermarkInfo = {
    x : Nat;
    y : Nat;
    width : Nat;
    height : Nat;
  };

  type VideoStatus = {
    #uploaded;
    #processing;
    #completed;
    #failed;
    #deleted;
  };

  type SafetyFeature = {
    showAlertOnLargeWatermark : Bool;
  };

  type VideoOwner = Principal;

  type VideoMetadata = {
    id : VideoId;
    owner : VideoOwner;
    fileName : Text;
    contentType : Text;
    uploadedAt : Time.Time;
    size : Nat;
    watermark : ?WatermarkInfo;
    status : VideoStatus;
  };

  public type UserProfile = {
    name : Text;
  };

  module VideoMetadata {
    public func compare(a : VideoMetadata, b : VideoMetadata) : Order.Order {
      Text.compare(a.id, b.id);
    };
  };

  // Video metadata store
  let videoStore = Map.empty<VideoId, VideoMetadata>();

  // User profiles store
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Counter for generating unique video IDs
  var videoIdCounter : Nat = 0;

  // Safety features (non-persistent in backend, logic handled in frontend)
  let safetyFeature : SafetyFeature = {
    showAlertOnLargeWatermark = true;
  };

  // Include MixinStorage for blob handling
  include MixinStorage();

  func checkAccessSecret(secret : Text) {
    if (secret != accessSecret) {
      Runtime.trap("Unauthorized: Invalid access secret");
    };
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile(secret : Text) : async ?UserProfile {
    checkAccessSecret(secret);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(secret : Text, user : Principal) : async ?UserProfile {
    checkAccessSecret(secret);
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(secret : Text, profile : UserProfile) : async () {
    checkAccessSecret(secret);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Video Upload/Management APIs
  public shared ({ caller }) func uploadVideo(secret : Text, fileName : Text, contentType : Text, size : Nat) : async VideoId {
    checkAccessSecret(secret);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload videos");
    };

    // Generate unique video ID
    videoIdCounter += 1;
    let timestamp = Int.abs(Time.now());
    let id = caller.toText() # "-" # videoIdCounter.toText() # "-" # timestamp.toText();

    let video : VideoMetadata = {
      id;
      owner = caller;
      fileName;
      contentType;
      size;
      uploadedAt = Time.now();
      watermark = null;
      status = #uploaded;
    };
    videoStore.add(id, video);
    id;
  };

  public shared ({ caller }) func markWatermark(secret : Text, videoId : VideoId, x : Nat, y : Nat, width : Nat, height : Nat) : async Bool {
    checkAccessSecret(secret);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark watermarks");
    };

    switch (videoStore.get(videoId)) {
      case (null) { false };
      case (?video) {
        if (video.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the owner or an admin can update watermark");
        };
        let newWatermark = ?{ x; y; width; height };
        let updatedVideo = { video with watermark = newWatermark };
        videoStore.add(videoId, updatedVideo);
        true;
      };
    };
  };

  public shared ({ caller }) func updateVideoStatus(secret : Text, videoId : VideoId, status : VideoStatus) : async Bool {
    checkAccessSecret(secret);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update video status");
    };

    switch (videoStore.get(videoId)) {
      case (null) { false };
      case (?video) {
        if (video.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the owner or an admin can update video status");
        };
        let updatedVideo = { video with status };
        videoStore.add(videoId, updatedVideo);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteVideo(secret : Text, videoId : VideoId) : async Bool {
    checkAccessSecret(secret);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete videos");
    };

    switch (videoStore.get(videoId)) {
      case (null) { false };
      case (?video) {
        if (video.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the owner or an admin can delete this video");
        };
        let updatedVideo = { video with status = #deleted };
        videoStore.add(videoId, updatedVideo);
        true;
      };
    };
  };

  public query ({ caller }) func getAllVideosByOwner(secret : Text, owner : Principal) : async [VideoMetadata] {
    checkAccessSecret(secret);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve videos");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    if (not isAdmin and owner != caller) {
      Runtime.trap("Unauthorized: You can only retrieve your own videos");
    };

    let videos = videoStore.filter(
      func(_, video) { video.owner == owner }
    );
    videos.values().toArray().sort();
  };

  public query ({ caller }) func getVideo(secret : Text, id : VideoId) : async ?VideoMetadata {
    checkAccessSecret(secret);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view videos");
    };

    switch (videoStore.get(id)) {
      case (null) { null };
      case (?video) {
        let isAdmin = AccessControl.isAdmin(accessControlState, caller);
        if (video.owner != caller and not isAdmin) {
          Runtime.trap("Unauthorized: You can only view your own videos");
        };
        ?video;
      };
    };
  };
};
