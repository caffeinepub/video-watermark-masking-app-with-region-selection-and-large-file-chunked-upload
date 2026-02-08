import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Principal "mo:core/Principal";

module {
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

  type VideoOwner = Principal.Principal;

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

  type UserProfile = {
    name : Text;
  };

  module VideoMetadata {
    public func compare(a : VideoMetadata, b : VideoMetadata) : Order.Order {
      Text.compare(a.id, b.id);
    };
  };

  type OldActor = {
    videoStore : Map.Map<VideoId, VideoMetadata>;
    userProfiles : Map.Map<Principal.Principal, UserProfile>;
    videoIdCounter : Nat;
    safetyFeature : SafetyFeature;
  };

  type NewActor = {
    videoStore : Map.Map<VideoId, VideoMetadata>;
    userProfiles : Map.Map<Principal.Principal, UserProfile>;
    videoIdCounter : Nat;
    safetyFeature : SafetyFeature;
  };

  public func run(old : OldActor) : NewActor {
    old;
  };
};
