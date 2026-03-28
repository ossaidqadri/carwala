"use client"

import Script from "next/script"
import { useEffect } from "react"

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "elevenlabs-convai": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        "agent-id"?: string
      }
    }
  }
}

function useHideShadowBranding() {
  useEffect(() => {
    const STYLE_ATTR = "data-hider"
    const CSS = `p:has(a[href*="elevenlabs.io/agents"]) { display: none !important; }`

    const injectStyle = (root: ShadowRoot) => {
      if (root.querySelector(`[${STYLE_ATTR}]`)) return
      const style = document.createElement("style")
      style.setAttribute(STYLE_ATTR, "true")
      style.textContent = CSS
      root.appendChild(style)
    }

    const attachToWidget = (widget: Element) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const root: ShadowRoot | null = (widget as any).shadowRoot

      if (root) {
        injectStyle(root)
        new MutationObserver(() => injectStyle(root)).observe(root, { childList: true, subtree: true })
        return
      }

      // Shadow root not ready — wait for custom element to be upgraded
      customElements.whenDefined("elevenlabs-convai").then(() => {
        requestAnimationFrame(() => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const upgradedRoot: ShadowRoot | null = (widget as any).shadowRoot
          if (!upgradedRoot) return
          injectStyle(upgradedRoot)
          new MutationObserver(() => injectStyle(upgradedRoot)).observe(upgradedRoot, { childList: true, subtree: true })
        })
      })
    }

    const existing = document.querySelector("elevenlabs-convai")
    if (existing) attachToWidget(existing)

    const bodyObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof Element && node.tagName.toLowerCase() === "elevenlabs-convai") {
            attachToWidget(node)
          }
        }
      }
    })
    bodyObserver.observe(document.body, { childList: true, subtree: true })

    return () => bodyObserver.disconnect()
  }, [])
}

export function ElevenLabsWidget({ agentId }: { agentId: string }) {
  useHideShadowBranding()

  return (
    <>
      {/* @ts-ignore */}
      <elevenlabs-convai agent-id={agentId} />
      <Script
        src="https://unpkg.com/@elevenlabs/convai-widget-embed"
        strategy="afterInteractive"
      />
    </>
  )
}
