"use client";
import { supabase } from "..//../lib/supabaseClient";
import { useEffect } from "react";

export default function TestPage() {
  useEffect(() => {
    async function checkConnection() {
      const { data, error } = await supabase.from("products").select("*").limit(1);
      if (error) console.error("❌ Connection failed:", error);
      else console.log("✅ Connected successfully:", data);
    }
    checkConnection();
  }, []);

  return <div>Check console...</div>;
}
