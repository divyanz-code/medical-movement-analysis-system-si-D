import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { patientFlow } from "@/src/runtime/client";
import type { Profile } from "@/src/types/contracts";

interface UserContextValue {
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<Profile | null>;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    try {
      const data = await patientFlow.getProfile();
      setProfile(data);
      return data;
    } catch (err) {
      console.log("UserContext: Failed to load profile", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  const logout = async () => {
    await patientFlow.logout();
    setProfile(null);
  };

  return (
    <UserContext.Provider value={{ profile, loading, refreshProfile, setProfile, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
};
