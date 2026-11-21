"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { Receipt as ReceiptData } from "@/lib/schema";

type ReceiptContextValue = {
  open: (r: ReceiptData) => void;
};

const ReceiptContext = createContext<ReceiptContextValue | null>(null);

export function useReceiptPanel() {
  const ctx = useContext(ReceiptContext);
  if (!ctx) throw new Error("useReceiptPanel must be used within ReceiptProvider");
  return ctx;
}

export function ReceiptProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<ReceiptData | null>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const open = useCallback((r: ReceiptData) => {
    lastTrigger.current = document.activeElement as HTMLElement;
    setActive(r);
  }, []);

  const close = useCallback(() => {
    setActive(null);
    lastTrigger.current?.focus();
  }, []);

  useEffect(() => {
    if (!active) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [active, close]);

  return (
    <ReceiptContext.Provider value={{ open }}>
      {children}
      <div
        aria-hidden={!active}
        className={`fixed inset-0 z-50 transition-opacity duration-200 ${
          active ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <button
          type="button"
          tabIndex={-1}
          aria-label="Close receipt panel"
          onClick={close}
          className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"
        />
        <aside
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Evidence"
          className={`glass-card glow-ring absolute right-2 top-2 bottom-2 w-full max-w-sm overflow-y-auto transition-transform duration-200 ${
            active ? "translate-x-0" : "translate-x-[110%]"
          }`}
        >
          <div className="flex items-center justify-between rounded-t-[20px] border-b border-line bg-terminal px-5 py-4">
            <span className="font-mono-label text-[11px] text-terminal-ink">Evidence</span>
            <button
              type="button"
              data-autofocus
              onClick={close}
              className="font-mono-label text-[11px] text-terminal-ink/80 hover:text-flag focus-visible:text-flag"
            >
              Esc · Close
            </button>
          </div>
          <div aria-live="polite" className="px-5 py-6">
            {active && (
              <div className="flex flex-col gap-4">
                <p className="text-lg leading-snug font-medium">{active.claim}</p>
                <p className="text-[15px] leading-relaxed text-ink-muted">{active.detail}</p>
                <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 border-t border-line pt-4 font-mono text-[12px]">
                  <dt className="text-ink-muted">Source</dt>
                  <dd>{active.source}</dd>
                  {active.date && (
                    <>
                      <dt className="text-ink-muted">Date</dt>
                      <dd>{active.date}</dd>
                    </>
                  )}
                </dl>
                {active.href && (
                  <a
                    href={active.href}
                    target="_blank"
                    rel="noreferrer"
                    className="link-draw font-mono-label text-[12px] text-signal w-fit"
                  >
                    Open source ↗
                  </a>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </ReceiptContext.Provider>
  );
}

export function Receipt({
  label = "SRC",
  claim,
  detail,
  source,
  href,
  date,
}: Omit<ReceiptData, "id"> & { label?: string }) {
  const { open } = useReceiptPanel();
  return (
    <button
      type="button"
      onClick={() => open({ id: label + claim, claim, detail, source, href, date })}
      className="mx-1 inline-flex translate-y-[-2px] items-center rounded-full border border-flag/40 px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.06em] text-flag transition-colors hover:bg-flag/10 focus-visible:bg-flag/10"
      aria-haspopup="dialog"
    >
      {label}
    </button>
  );
}
