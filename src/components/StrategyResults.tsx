// src/components/StrategyResults.tsx
import ReactMarkdown from "react-markdown";
import { Sparkles } from "lucide-react";

interface ResultProps {
  content: string;
}

export default function StrategyResults({ content }: ResultProps) {
  if (!content) return null;

  return (
    <div className="mt-8 bg-white rounded-2xl shadow-xl border-t-4 border-blue-600 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Sparkles className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Rekomendasi Strategi AI</h2>
        </div>

        {/* Markdown Renderer Area */}
        <div className="prose prose-slate max-w-none prose-headings:text-blue-800 prose-headings:font-bold prose-p:text-slate-600 prose-li:text-slate-600 prose-strong:text-slate-900">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
      
      <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-400">
          *Hasil digenerate oleh AI. Sesuaikan kembali dengan kondisi lapangan.
        </p>
      </div>
    </div>
  );
}