import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { UserRole } from "../types";
import { institution as defaultInstitution } from "../mockData";

type LoginResult = "success" | "invalid_credentials" | "session_unavailable";

interface AuthContextProps {
  isAuthenticated: boolean;
  userRole: UserRole;
  institutionId: string;
  officerId: string;
  institutionName: string;
  login: (role: UserRole, id: string, password: string) => LoginResult;
  logout: () => void;
}

interface StoredSession {
  role: UserRole;
  id: string;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);
const SESSION_KEY = "veriscrutiny_auth_session";
const DEMO_PASSWORD = "demo123";
const DEMO_ACCOUNTS: Record<UserRole, string> = {
  institution: "KEC001",
  aicte: "AICTE-SR-9042",
};

function readStoredSession(): StoredSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const stored = JSON.parse(raw) as Partial<StoredSession>;
    if (
      (stored.role !== "institution" && stored.role !== "aicte") ||
      stored.id !== DEMO_ACCOUNTS[stored.role]
    ) {
      return null;
    }

    return { role: stored.role, id: stored.id };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<StoredSession | null>(readStoredSession);

  const login = (role: UserRole, id: string, password: string): LoginResult => {
    const normalizedId = id.trim().toUpperCase();
    if (normalizedId !== DEMO_ACCOUNTS[role] || password !== DEMO_PASSWORD) {
      return "invalid_credentials";
    }

    const nextSession = { role, id: DEMO_ACCOUNTS[role] };
    try {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
    } catch {
      return "session_unavailable";
    }

    setSession(nextSession);
    return "success";
  };

  const logout = () => {
    setSession(null);
    try {
      window.localStorage.removeItem(SESSION_KEY);
    } catch {
      // The current page is still logged out even if browser storage is unavailable.
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: session !== null,
        userRole: session?.role ?? "institution",
        institutionId: session?.role === "institution" ? session.id : DEMO_ACCOUNTS.institution,
        officerId: session?.role === "aicte" ? session.id : DEMO_ACCOUNTS.aicte,
        institutionName: defaultInstitution.name,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
