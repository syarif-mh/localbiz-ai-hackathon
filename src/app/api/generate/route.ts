// src/app/api/generate/route.ts

import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { NextResponse } from "next/server";

// 1. Definisikan Schema Output untuk Memaksa Gemini Mengembalikan JSON
const responseSchema = {
    type: SchemaType.OBJECT,
    properties: {
        strategy_text: {
            type: SchemaType.STRING,
            description: "Strategi komprehensif UMKM yang sudah diformat rapi dalam Markdown.",
        },
    },
    required: ["strategy_text"],
};

const geminiApiKey = process.env.GEMINI_API_KEY;
const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;


export async function POST(req: Request) {
    
    if (!geminiApiKey || !genAI) {
        console.error("ERROR: GEMINI_API_KEY TIDAK DITEMUKAN. Cek .env.local/Vercel.");
        return NextResponse.json(
            { error: "Konfigurasi Server Gagal: Kunci API Gemini hilang." },
            { status: 500 }
        );
    }
    
    console.log("DEBUG: GEMINI_API_KEY berhasil dimuat.");

    try {
        const body = await req.json();
        const { businessType, product, audience } = body;

        // --- Prompt Engineering ---
        const systemInstruction = `
ROLE: Anda adalah 'Senior Indonesian Local Business Consultant' (Konsultan Bisnis UMKM Senior).
GOAL: Membantu pelaku usaha kecil (UMKM) di Indonesia meningkatkan penjualan, branding, dan digital presence.
TONE & STYLE: Bahasa Indonesia yang luwes, ramah, membumi, dan mudah dipahami.
CONTEXT: Berikan solusi praktis, hemat biaya (low-cost), dan harus disesuaikan dengan pasar lokal.
        `;
        
        const finalPrompt = `
${systemInstruction}

TUGAS: Berdasarkan input pengguna:
- Jenis Usaha: ${businessType}
- Produk/Jasa: ${product}
- Target Audiens: ${audience}

Buatlah strategi komprehensif dalam format Markdown yang rapi yang mencakup 4 bagian wajib:
1. 💰 Model Pricing & Strategi Penjualan (dalam Rupiah).
2. 📸 3 Ide Caption Instagram yang Menarik.
3. 💡 3 Ide Konten High-Engagement untuk media sosial.
4. 📦 Tips Packaging & Branding Sederhana.
        `;
        
        // --- 4. Konfigurasi Model & Panggilan API (PERBAIKAN) ---
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        }); 

        // Panggilan generateContent yang BENAR
        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [{ text: finalPrompt }]
                }
            ]
        });

        // 5. Parsing dan Verifikasi Hasil
        const response = await result.response;
        const textResponse = response.text();
        
        // Parse JSON response
        const jsonResponse = JSON.parse(textResponse);
        const strategyText = jsonResponse.strategy_text;

        // Debug final
        console.log("DEBUG: Panjang response Gemini:", strategyText ? strategyText.length : 0);

        // Mengembalikan Hasil ke Frontend
        return NextResponse.json({ result: strategyText });

    } catch (error) {
        console.error("Gemini API Error:", error);
        
        // Error handling yang lebih detail
        if (error instanceof SyntaxError) {
            return NextResponse.json(
                { error: "Gagal memproses hasil AI. Format output tidak valid. Coba lagi dengan input yang lebih spesifik." },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { 
                error: "Terjadi kesalahan internal. Periksa terminal Next.js Anda untuk detail error.",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}