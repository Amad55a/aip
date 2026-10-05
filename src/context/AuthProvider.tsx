"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import type { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { Profile } from "@/lib/supabase/database.types";
import { upsertOwnProfile } from "@/lib/auth/profile";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  setProfile: (profile: Profile) => void;
  loading: boolean;
  configured: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const configured = isSupabaseConfigured();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(configured);

  const loadProfile = useCallback(async (currentUser: User) => {
    const supabase = createClient();
    await upsertOwnProfile(supabase, currentUser);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", currentUser.id)
      .maybeSingle();

    if (error) {
      console.error("Failed to load profile:", error.message);
      return;
    }

    setProfile(data);
  }, []);

  useEffect(() => {
    if (!configured) {
      return;
    }

    const supabase = createClient();
    let cancelled = false;

    supabase.auth.getSession().then(({ data: { session: nextSession } }) => {
      if (cancelled) return;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      if (nextSession?.user) {
        void loadProfile(nextSession.user);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      if (nextSession?.user) {
        void loadProfile(nextSession.user);
      } else {
        setProfile(null);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [configured, loadProfile]);

  const signOut = useCallback(async () => {
    if (configured) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setProfile(null);
    router.push("/signin");
    router.refresh();
  }, [configured, router]);

  const refreshProfile = useCallback(async () => {
    if (user) await loadProfile(user);
  }, [loadProfile, user]);

  const value = useMemo(
    () => ({
      user,
      session,
      profile,
      setProfile,
      loading,
      configured,
      signOut,
      refreshProfile,
    }),
    [user, session, profile, setProfile, loading, configured, signOut, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
}
