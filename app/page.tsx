import { Hero } from "@/components/hero";
import { WhatIBuild } from "@/components/what-i-build";
import { FlagshipWidget } from "@/components/flagship-widget";
import { SystemsIndex } from "@/components/systems-index";
import { LiveDemoSection, WritingPreview, NowPreview } from "@/components/home-secondary";
import { Bio } from "@/components/bio";
import { WorldShift } from "@/components/effects/world-shift";

export default function Home() {
  return (
    <>
      <WorldShift />

      <Hero />

      <section
        id="chapter-about"
        className="relative flex min-h-screen flex-col justify-center gap-16 overflow-hidden py-20"
      >
        <WhatIBuild />
        <Bio />
      </section>

      <section
        id="chapter-systems"
        className="relative flex min-h-screen flex-col justify-center gap-6 overflow-hidden py-20"
      >
        <FlagshipWidget />
        <SystemsIndex />
      </section>

      <LiveDemoSection />

      <section
        id="chapter-writing"
        className="relative flex min-h-screen flex-col justify-center gap-16 overflow-hidden py-20"
      >
        <WritingPreview />
        <NowPreview />
      </section>
    </>
  );
}
