/**
 * Common Model Types
 * Shared types used across multiple models
 */

/**
 * Mongoose ObjectId type (as string for plain TypeScript usage)
 */
export type ObjectId = string;

/**
 * Timestamp fields present in all models
 */
export interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Common metadata pattern used across models
 */
export interface CommonMetadata {
  isFavorite?: boolean;
  tags?: string[];
  category?: string;
}

/**
 * Date range interface
 */
export interface DateRange {
  startDate?: Date;
  endDate?: Date;
  current?: boolean;
}
