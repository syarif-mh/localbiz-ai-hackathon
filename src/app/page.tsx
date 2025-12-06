// File: src/app/page.tsx
"use client";

import { useState } from "react";
import BusinessInputForm from "@/components/BusinessInputForm";
import StrategyResults from "@/components/StrategyResults";
import { Store, TrendingUp } from "lucide-react";

export default function Home() {
  // State Management
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // --- 3. FRONTEND INTEGRATION LOGIC ---
  const handleGenerateStrategy = async (data: { businessType: string; productDesc: string; audience: string }) => {
    setLoading(true);
    setError("");
    setResult(""); // Bersihkan hasil sebelumnya

    try {
      // Mempersiapkan payload sesuai ekspektasi API Route
      const payload = {
        businessType: data.businessType,
        product: data.productDesc, // Mapping dari productDesc ke product
        audience: data.audience,
      };

      // Call API Route
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Terjadi kesalahan saat menghubungi server.");
      }

      // Update state dengan hasil dari AI
      setResult(json.result);
      
    } catch (err) {
      console.error(err);
      setError("Maaf, terjadi kendala saat meracik strategi. Coba lagi ya!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* Header Section */}
      <div className="bg-blue-700 text-white pt-12 pb-24 px-4 shadow-sm">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full backdrop-blur-sm mb-4 border border-white/20">
            <TrendingUp className="w-8 h-8 text-yellow-300" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
            LocalBiz AI
          </h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-xl mx-auto">
            Konsultan bisnis pribadi untuk UMKM. Dapatkan strategi marketing, harga, dan konten instan berbasis AI.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-3xl mx-auto px-4 -mt-16 relative z-10 space-y-8">
        
        {/* Component 1: Input Form */}
        <BusinessInputForm 
          onSubmit={handleGenerateStrategy} 
          loading={loading} 
        />

        {/* Error Message Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-center animate-in fade-in">
            {error}
          </div>
        )}

        {/* Component 2: Results Display */}
        {/* Hanya muncul jika ada hasil */}
        {result && <StrategyResults content={result} />}

      </div>
      
      {/* Footer Simple */}
      <footer className="mt-20 text-center text-slate-400 text-sm py-6">
        &copy; {new Date().getFullYear()} LocalBiz AI - Inovasi untuk UMKM Indonesia
      </footer>
    </main>
  );
}