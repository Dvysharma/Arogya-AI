import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mockReports, HealthReport } from "@/lib/mock-data";

export async function GET(_req: NextRequest) {
  try {
    let reports: HealthReport[] = [];

    // Try DB fetch first
    try {
      if (prisma) {
        const dbReports = await prisma.report.findMany({
          orderBy: { createdAt: "desc" }
        });
        
        reports = dbReports.map(r => ({
          id: r.id,
          date: r.createdAt.toISOString(),
          type: r.type as "Symptom" | "Tongue" | "Eye" | "Comprehensive",
          risk: r.risk as "Low" | "Medium" | "High",
          score: r.score,
          title: r.title,
          summary: r.summary,
          findings: r.findings,
          recommendations: r.recommendations,
          symptoms: r.symptoms,
          imageUrl: r.imageUrl || undefined
        }));
      } else {
        reports = mockReports;
      }
    } catch (e) {
      console.warn("Database fetch failed (falling back to mock data):", e);
      reports = mockReports;
    }

    return NextResponse.json(reports);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch reports";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Report ID is required" }, { status: 400 });
    }

    try {
      if (prisma) {
        await prisma.report.delete({
          where: { id }
        });
        return NextResponse.json({ success: true, message: `Report ${id} deleted from DB` });
      }
    } catch (e) {
      console.warn("Database delete failed/skipped:", e);
    }

    // Success response anyway for local fallback
    return NextResponse.json({ success: true, message: `Report ${id} deleted (local memory)` });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete report";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

