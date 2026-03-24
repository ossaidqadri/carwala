import { NextRequest } from 'next/server'
import crypto from 'crypto'

function toMistralId(id: string): string {
  return crypto.createHash('md5').update(id).digest('hex').substring(0, 9)
}

function rewriteToolCallIds(messages: any[]): any[] {
  const idMap: Record<string, string> = {}

  for (const msg of messages) {
    if (msg.role === 'assistant' && Array.isArray(msg.tool_calls)) {
      for (const tc of msg.tool_calls) {
        if (tc.id && !/^[a-zA-Z0-9]{9}$/.test(tc.id)) {
          const mistralId = toMistralId(tc.id)
          idMap[tc.id] = mistralId
          tc.id = mistralId
        }
      }
    }

    if (msg.role === 'tool' && msg.tool_call_id) {
      const orig = msg.tool_call_id
      if (idMap[orig]) {
        msg.tool_call_id = idMap[orig]
      } else if (!/^[a-zA-Z0-9]{9}$/.test(orig)) {
        msg.tool_call_id = toMistralId(orig)
      }
    }
  }

  return messages
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  if (Array.isArray(body.messages)) {
    body.messages = rewriteToolCallIds(body.messages)
  }

  const mistralRes = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  return new Response(mistralRes.body, {
    status: mistralRes.status,
    headers: {
      'Content-Type': mistralRes.headers.get('Content-Type') ?? 'application/json',
    },
  })
}
