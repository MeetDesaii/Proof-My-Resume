import "@clerk/express";
import { User } from "@visume/types";

declare global {
  namespace Express {
    interface Request {
      auth: {
        userId: string;
        sessionId: string;
        orgId?: string;
        orgRole?: string;
        orgSlug?: string;
        actor?: {
          sub: string;
        };
        sessionClaims?: Record<string, any>;
        getToken: (options?: {
          template?: string;
          leewayInSeconds?: number;
        }) => Promise<string | null>;
        has: (authorization: { role?: string; permission?: string }) => boolean;
        debug: () => Record<string, any>;
      };
      user?: User;
      currentUser?: any; // Clerk User object from optional auth
      authOptional?: {
        signedIn: boolean;
        userId: string | null;
        sessionId: string | null;
        orgId: string | null;
      };
    }
  }
}

export {};
