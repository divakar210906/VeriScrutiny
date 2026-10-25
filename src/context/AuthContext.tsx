// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<UserRole>("institution"); // Default to institution view
  const [institutionId, setInstitutionId] = useState<string>("KEC001");
  const [officerId, setOfficerId] = useState<string>("AICTE001");
  const [institutionName, setInstitutionName] = useState<string>(defaultInstitution.name);

  // Read stored auth session
  useEffect(() => {
    const stored = localStorage.getItem("veriscrutiny_auth_session");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setIsAuthenticated(true);
        setUserRole(parsed.role || "institution");
        setInstitutionId(parsed.institutionId || "KEC001");
        setOfficerId(parsed.officerId || "AICTE001");
        setInstitutionName(parsed.institutionName || defaultInstitution.name);
      } catch {
        // fallback
      }
    }
  }, []);

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
      persistSession("institution", id || "KEC001", officerId);
    } else {
      setOfficerId(id || "AICTE001");
      persistSession("aicte", institutionId, id || "AICTE001");
    }
    return true;
  };

  const switchRole = (newRole: UserRole) => {
    setUserRole(newRole);
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
