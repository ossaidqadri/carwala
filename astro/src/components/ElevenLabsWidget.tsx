import { useEffect } from 'react';

declare global {
  namespace React.JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'agent-id'?: string;
      };
    }
  }
}

function useHideShadowBranding() {
  useEffect(() => {
    const STYLE_ATTR = 'data-hider';
    const CSS = `p:has(a[href*="elevenlabs.io/agents"]) { display: none !important; }`;

    const injectStyle = (root: ShadowRoot) => {
      if (root.querySelector(`[${STYLE_ATTR}]`)) return;
      const style = document.createElement('style');
      style.setAttribute(STYLE_ATTR, 'true');
      style.textContent = CSS;
      root.appendChild(style);
    };

    const attachToWidget = (widget: Element) => {
      const root: ShadowRoot | null = (widget as unknown as { shadowRoot: ShadowRoot }).shadowRoot;

      if (root) {
        injectStyle(root);
        new MutationObserver(() => injectStyle(root)).observe(root, { childList: true, subtree: true });
        return;
      }

      customElements.whenDefined('elevenlabs-convai').then(() => {
        requestAnimationFrame(() => {
          const upgradedRoot: ShadowRoot | null = (widget as unknown as { shadowRoot: ShadowRoot }).shadowRoot;
          if (!upgradedRoot) return;
          injectStyle(upgradedRoot);
          new MutationObserver(() => injectStyle(upgradedRoot)).observe(upgradedRoot, { childList: true, subtree: true });
        });
      });
    };

    const existing = document.querySelector('elevenlabs-convai');
    if (existing) attachToWidget(existing);

    const bodyObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof Element && node.tagName.toLowerCase() === 'elevenlabs-convai') {
            attachToWidget(node);
          }
        }
      }
    });
    bodyObserver.observe(document.body, { childList: true, subtree: true });

    return () => bodyObserver.disconnect();
  }, []);
}

export default function ElevenLabsWidget({ agentId }: { agentId: string }) {
  useHideShadowBranding();

  useEffect(() => {
    const SCRIPT_SRC = 'https://unpkg.com/@elevenlabs/convai-widget-embed';

    if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return;

    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    document.head.appendChild(script);
  }, []);

  return (
    <>
      <elevenlabs-convai agent-id={agentId} />
      <link rel="preload" href="https://unpkg.com/@elevenlabs/convai-widget-embed" as="script" />
    </>
  );
}
