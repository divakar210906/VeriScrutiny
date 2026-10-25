// src/context/AuthContext.tsx
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { UserRole } from "../types";
import { institution as defaultInstitution } from "../mockData";

interface AuthContextProps {
  isAuthenticated: boolean;
  userRole: UserRole;
  institutionId: string;
  officerId: string;
  institutionName: string;
  login: (role: UserRole, id: string, pass: string) => boolean;
  switchRole: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const getStoredSession = () => {
  const fallback = {
    isAuthenticated: false,
    role: "institution" as UserRole,
    institutionId: "KEC001",
    officerId: "AICTE-SR-9042",
    institutionName: defaultInstitution.name,
  };

  if (typeof window === "undefined") {
    return fallback;
  }

  const stored = window.localStorage.getItem("veriscrutiny_auth_session");
  if (!stored) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(stored) as Partial<typeof fallback>;
    return {
      isAuthenticated: true,
      role: (parsed.role as UserRole) || fallback.role,
      institutionId: parsed.institutionId || fallback.institutionId,
      officerId: parsed.officerId || fallback.officerId,
      institutionName: parsed.institutionName || fallback.institutionName,
    };
  } catch {
    return fallback;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const session = getStoredSession();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(session.isAuthenticated);
  const [userRole, setUserRole] = useState<UserRole>(session.role);
  const [institutionId, setInstitutionId] = useState<string>(session.institutionId);
  const [officerId, setOfficerId] = useState<string>(session.officerId);
  const [institutionName, setInstitutionName] = useState<string>(session.institutionName);

  const persistSession = (role: UserRole, instId: string, offId: string) => {
    localStorage.setItem(
      "veriscrutiny_auth_session",
      JSON.stringify({
        role,
        institutionId: instId,
        officerId: offId,
        institutionName: defaultInstitution.name,
      })
    );
  };

  const login = (role: UserRole, id: string, _pass: string): boolean => {
    setIsAuthenticated(true);
    setUserRole(role);
    if (role === "institution") {
      setInstitutionId(id || "KEC001");
      setInstitutionName(defaultInstitution.name);
      persistSession("institution", id || "KEC001", officerId);
    } else {
      setOfficerId(id || "AICTE001");
      setInstitutionName(defaultInstitution.name);
      persistSession("aicte", institutionId, id || "AICTE001");
    }
    return true;
  };

  const switchRole = (newRole: UserRole) => {
    setUserRole(newRole);
    setInstitutionName(defaultInstitution.name);
    persistSession(newRole, institutionId, officerId);
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("veriscrutiny_auth_session");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        institutionId,
        officerId,
        institutionName,
        login,
        switchRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
