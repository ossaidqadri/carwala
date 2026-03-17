import { NextResponse } from "next/server";

/**
 * Generate a signed URL for embedding the Areeb voice agent on the website.
 * Used with @elevenlabs/react useConversation hook or web widget.
 *
 * Requires ELEVENLABS_API_KEY and ELEVENLABS_AGENT_ID environment variables.
 */
export async function POST() {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const agentId = process.env.ELEVENLABS_AGENT_ID;

    if (!apiKey) {
      return NextResponse.json(
        { error: "ELEVENLABS_API_KEY not configured" },
        { status: 500 }
      );
    }

    if (!agentId) {
      return NextResponse.json(
        { error: "ELEVENLABS_AGENT_ID not configured. Run 'elevenlabs agents push' first." },
        { status: 500 }
      );
    }

    // Call ElevenLabs API to get signed URL
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/agents/${agentId}/signed-url`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("ElevenLabs signed URL error:", response.status, errorData);
      return NextResponse.json(
        { error: "Failed to generate signed URL from ElevenLabs" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ signedUrl: data.signed_url });

  } catch (error) {
    console.error("Agent session error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
