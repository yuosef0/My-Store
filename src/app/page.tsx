"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        console.error("❌ Error fetching data:", error);
      } else {
        console.log("✅ Data from Supabase:", data);
        setData(data || []);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold mb-5">📦 Products from Supabase</h1>
      {data.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ul className="space-y-3">
          {data.map((item) => (
            <li key={item.id} className="p-4 bg-gray-100 rounded-md shadow-sm">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-600">{item.price} EGP</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}