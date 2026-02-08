import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
}
export type Time = bigint;
export type VideoId = string;
export interface VideoMetadata {
    id: VideoId;
    status: VideoStatus;
    contentType: string;
    owner: VideoOwner;
    size: bigint;
    fileName: string;
    watermark?: WatermarkInfo;
    uploadedAt: Time;
}
export interface WatermarkInfo {
    x: bigint;
    y: bigint;
    height: bigint;
    width: bigint;
}
export type VideoOwner = Principal;
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum VideoStatus {
    deleted = "deleted",
    completed = "completed",
    uploaded = "uploaded",
    processing = "processing",
    failed = "failed"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteVideo(secret: string, videoId: VideoId): Promise<boolean>;
    getAllVideosByOwner(secret: string, owner: Principal): Promise<Array<VideoMetadata>>;
    getCallerUserProfile(secret: string): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(secret: string, user: Principal): Promise<UserProfile | null>;
    getVideo(secret: string, id: VideoId): Promise<VideoMetadata | null>;
    isCallerAdmin(): Promise<boolean>;
    markWatermark(secret: string, videoId: VideoId, x: bigint, y: bigint, width: bigint, height: bigint): Promise<boolean>;
    saveCallerUserProfile(secret: string, profile: UserProfile): Promise<void>;
    updateVideoStatus(secret: string, videoId: VideoId, status: VideoStatus): Promise<boolean>;
    uploadVideo(secret: string, fileName: string, contentType: string, size: bigint): Promise<VideoId>;
}
