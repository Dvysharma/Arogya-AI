import { NextRequest, NextResponse } from "next/server";
import { localAnalyzeHealth, AnalysisInput } from "@/lib/analyzer";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const input: AnalysisInput = await req.json();
    let analysisResult;

    const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:8000";

    // Check if we want to call the local/remote FastAPI backend
    try {
      if (input.type === "Comprehensive" || input.type === "Symptom") {
        const response = await fetch(`${backendUrl}/analyze/symptoms`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            age: input.age ?? 25,
            gender: input.gender ?? "Male",
            sleepHours: input.sleepHours ?? 7,
            smoking: input.smoking ?? "No",
            alcohol: input.alcohol ?? "No",
            exercise: input.exercise ?? "3-5 days/week",
            sysBP: input.sysBP ?? 120,
            diaBP: input.diaBP ?? 80,
            bloodSugar: input.bloodSugar ?? null,
            bmi: input.bmi ?? 22.5,
            symptoms: input.symptoms ?? [],
            symptomText: input.symptomText ?? ""
          }),
        });

        if (response.ok) {
          analysisResult = await response.json();
          analysisResult.id = analysisResult.id || "rep-" + Math.floor(Math.random() * 100000);
          analysisResult.date = analysisResult.date || new Date().toISOString();
          analysisResult.type = input.type;
        } else {
          throw new Error("FastAPI symptoms endpoint returned non-OK status");
        }
      } else {
        // Tongue or Eye scan
        // If imageB64 is not present (mock demo paths), fall back to rules
        if (!input.imageB64) {
          throw new Error("Image base64 data not found. Falling back.");
        }

        const response = await fetch(`${backendUrl}/analyze/image`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: input.type,
            imageB64: input.imageB64
          }),
        });

        if (response.ok) {
          analysisResult = await response.json();
          analysisResult.id = analysisResult.id || "rep-" + Math.floor(Math.random() * 100000);
          analysisResult.date = analysisResult.date || new Date().toISOString();
          analysisResult.type = input.type;
        } else {
          throw new Error("FastAPI image endpoint returned non-OK status");
        }
      }
    } catch (fastApiError) {
      console.warn("Connection to local FastAPI service failed, falling back to NextJS local analyzer:", fastApiError);
      analysisResult = localAnalyzeHealth(input);
    }

    // Try to save the report to the PostgreSQL database via Prisma
    try {
      if (prisma) {
        await prisma.report.create({
          data: {
            id: analysisResult.id,
            type: analysisResult.type,
            risk: analysisResult.risk,
            score: analysisResult.score,
            title: analysisResult.title,
            summary: analysisResult.summary,
            findings: analysisResult.findings,
            recommendations: analysisResult.recommendations,
            symptoms: analysisResult.symptoms || [],
            imageUrl: input.imageB64 ? "uploaded" : null
          }
        });
      }
    } catch (dbError) {
      console.warn("Database storage skipped (DATABASE_URL may not be configured):", dbError);
    }

    return NextResponse.json(analysisResult);
  } catch (error: any) {
    console.error("Analysis handler failed:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
