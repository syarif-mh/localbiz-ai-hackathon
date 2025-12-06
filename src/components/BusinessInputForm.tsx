// src/components/BusinessInputForm.tsx
"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";

interface FormProps {
  onSubmit: (data: { businessType: string; productDesc: string; audience: string }) => void;
  loading: boolean;
}

export default function BusinessInputForm({ onSubmit, loading }: FormProps) {
  const [formData, setFormData] = useState({
    businessType: "",
    productDesc: "",
    audience: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-slate-100">
      <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
        📝 Isi Detail Usaha
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Input 1: Jenis Usaha */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            1. Jenis Usaha
          </label>
          <input
            name="businessType"
            required
            placeholder="Contoh: Coffee Shop, Angkringan, Kerajinan Tangan"
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            onChange={handleChange}
          />
        </div>

        {/* Input 2: Deskripsi Produk */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            2. Deskripsi Produk/Jasa
          </label>
          <textarea
            name="productDesc"
            required
            rows={3}
            placeholder="Jelaskan produk utamamu. Contoh: Kopi susu gula aren dengan biji kopi lokal, harga terjangkau."
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none"
            onChange={handleChange}
          />
        </div>

        {/* Input 3: Target Audience */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            3. Target Pembeli
          </label>
          <input
            name="audience"
            required
            placeholder="Contoh: Mahasiswa, Ibu Rumah Tangga, Pekerja Kantoran"
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            onChange={handleChange}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sedang Menganalisis...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Dapatkan Strategi Instan
            </>
          )}
        </button>
      </form>
    </div>
  );
}