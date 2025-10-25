export enum SuggestionsAcceptanceStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
}
export enum SuggestionsOperationAction {
  REPLACE = "REPLACE",
  ADD = "ADD",
  REMOVE = "REMOVE",
}
export enum SuggestionsPriority {
  RECOMMENDED = "RECOMMENDED",
  CRITICAL = "CRITICAL",
}

export interface SuggestionsOperation {
  action: SuggestionsOperationAction;
  value: string;
  actual: string;
}

export interface Suggestions {
  acceptanceStatus: SuggestionsAcceptanceStatus;
  _id: string;
  title: string;
  isBlurred: boolean;
  description: string;
  operation: SuggestionsOperation;
  priority: SuggestionsPriority;
  path: string;
  documentPath: string;
  sectionName: string;
  createdAt: Date;
  updatedAt: Date;
}
