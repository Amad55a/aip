import { NextResponse } from "next/server";
import { getAIDailyUsage } from "@/lib/ai/usage";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Please sign in to check AI Mentor usage." }, { status: 401 });
  }

  try {
    const usage = await getAIDailyUsage(supabase);
    return NextResponse.json({ usage });
  } catch {
    return NextResponse.json({ error: "AI Mentor usage is temporarily unavailable." }, { status: 503 });
  }
}
