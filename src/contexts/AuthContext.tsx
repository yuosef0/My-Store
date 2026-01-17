"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  adminRole: string | null;
  signInWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState<string | null>(null);

  useEffect(() => {
    // جلب الجلسة الحالية
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // الاستماع لتغييرات المصادقة
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // التحقق من صلاحيات الأدمن
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          console.log("🔍 Checking admin status for user:", user.id, user.email);

          const { data, error } = await supabase
            .from("admins")
            .select("role, is_active")
            .eq("user_id", user.id)
            .eq("is_active", true)
            .single();

          console.log("📊 Admin query result:", { data, error });

          if (data && !error) {
            console.log("✅ User IS admin:", data);
            setIsAdmin(true);
            setAdminRole(data.role);
          } else {
            console.log("❌ User is NOT admin:", error?.message || "No data");
            setIsAdmin(false);
            setAdminRole(null);
          }
        } catch (error) {
          console.error("💥 Error checking admin status:", error);
          setIsAdmin(false);
          setAdminRole(null);
        }
      } else {
        console.log("👤 No user logged in");
        setIsAdmin(false);
        setAdminRole(null);
      }
    };

    checkAdminStatus();
  }, [user]);

  // تسجيل الدخول بالبريد الإلكتروني
  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  // التسجيل بالبريد الإلكتروني
  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    return { error };
  };

  // تسجيل الدخول بـ Google
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { error };
  };

  // تسجيل الخروج
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    isAdmin,
    adminRole,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
