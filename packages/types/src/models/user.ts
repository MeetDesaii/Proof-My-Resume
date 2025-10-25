/**
 * User Model Types
 */

import type { ObjectId, Timestamps } from "./common";

/**
 * Auth provider information
 */
export interface UserAuthProvider {
  provider: any;
  email?: string;
}

/**
 * User subscription details
 */
export interface UserSubscription {
  tier: any;
  validUntil?: Date;
  creditsRemaining: number;
  monthlyCredits: number;
}

/**
 * User profile information
 */
export interface UserProfile {
  title?: string;
  industry?: string;
  experience?: string;
  location?: string;
  skills?: string[];
  targetRoles?: string[];
}

/**
 * User settings
 */
export interface UserSettings {
  emailNotifications: boolean;
  weeklyReport: boolean;
  autoSave: boolean;
  aiSuggestions: boolean;
}

/**
 * User statistics
 */
export interface UserStats {
  resumesCreated: number;
  jobsAnalyzed: number;
  applicationsTracked: number;
  lastActive: Date;
}

/**
 * Plain User type (without Mongoose Document)
 */
export interface User extends Timestamps {
  _id?: ObjectId;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  emailVerified: boolean;
  authProviders: UserAuthProvider[];
  subscription: UserSubscription;
  profile: UserProfile;
  settings: UserSettings;
  stats: UserStats;
}

/**
 * User creation input (without timestamps and generated fields)
 */
export type UserCreateInput = Omit<User, "_id" | "createdAt" | "updatedAt">;

/**
 * User update input (all fields optional except identifiers)
 */
export type UserUpdateInput = Partial<Omit<User, "_id" | "clerkId">>;
