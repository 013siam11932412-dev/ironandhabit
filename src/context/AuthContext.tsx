"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type {
  User,
  Session,
  AuthError,
  AuthResponse,
  AuthTokenResponsePassword,
} from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  activeAuthTab: "signin" | "signup";
  openAuthModal: (tab?: "signin" | "signup") => void;
  closeAuthModal: () => void;
  setAuthTab: (tab: "signin" | "signup") => void;
  signInWithEmail: (
    email: string,
    password: string
  ) => Promise<AuthTokenResponsePassword>;
  signUpWithEmail: (
    email: string,
    password: string,
    name?: string
  ) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [activeAuthTab, setActiveAuthTab] = useState<"signin" | "signup">("signin");

  useEffect(() => {
    let mounted = true;

    // Fetch initial active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    });

    // Listen to Supabase auth events
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const openAuthModal = useCallback((tab: "signin" | "signup" = "signin") => {
    setActiveAuthTab(tab);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const setAuthTab = useCallback((tab: "signin" | "signup") => {
    setActiveAuthTab(tab);
  }, []);

  const signInWithEmail = useCallback(
    async (email: string, password: string): Promise<AuthTokenResponsePassword> => {
      try {
        const result = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        return result;
      } catch (err: unknown) {
        const error = (
          err instanceof Error
            ? { message: err.message, name: err.name, status: 500 }
            : { message: String(err), name: "AuthError", status: 500 }
        ) as AuthError;
        return {
          data: { user: null, session: null },
          error,
        };
      }
    },
    []
  );

  const signUpWithEmail = useCallback(
    async (
      email: string,
      password: string,
      name?: string
    ): Promise<AuthResponse> => {
      try {
        const result = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name || "",
            },
          },
        });
        return result;
      } catch (err: unknown) {
        const error = (
          err instanceof Error
            ? { message: err.message, name: err.name, status: 500 }
            : { message: String(err), name: "AuthError", status: 500 }
        ) as AuthError;
        return {
          data: { user: null, session: null },
          error,
        };
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("SignOut error:", err);
    } finally {
      setUser(null);
      setSession(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthModalOpen,
        activeAuthTab,
        openAuthModal,
        closeAuthModal,
        setAuthTab,
        signInWithEmail,
        signUpWithEmail,
        signOut,
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
