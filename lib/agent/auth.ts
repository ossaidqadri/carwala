import { NextRequest, NextResponse } from "next/server";

export function validateAgentRequest(request: NextRequest): { valid: boolean; response?: NextResponse } {
  const token = request.headers.get("x-agent-token");

  if (!process.env.AGENT_SECRET_TOKEN) {
    console.error("AGENT_SECRET_TOKEN not configured");
    return {
      valid: false,
      response: NextResponse.json({ error: "Agent token not configured" }, { status: 500 }),
    };
  }

  if (token !== process.env.AGENT_SECRET_TOKEN) {
    return {
      valid: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { valid: true };
}
