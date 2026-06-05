export function validateAgentRequest(request: Request): { valid: boolean; response?: Response } {
  const token = request.headers.get("x-agent-token");

  if (!import.meta.env.AGENT_SECRET_TOKEN) {
    console.error("AGENT_SECRET_TOKEN not configured");
    return {
      valid: false,
      response: new Response(JSON.stringify({ error: "Agent token not configured" }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }),
    };
  }

  if (token !== import.meta.env.AGENT_SECRET_TOKEN) {
    return {
      valid: false,
      response: new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }),
    };
  }

  return { valid: true };
}