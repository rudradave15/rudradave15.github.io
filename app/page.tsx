import { Hero } from "@/components/hero";
import { SystemsIndex } from "@/components/systems-index";
import { Summary, Experience, Skills, Education, Leadership } from "@/components/resume";
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
        <Summary />
        <Experience />
      </section>

      <section
        id="chapter-systems"
        className="relative flex min-h-screen flex-col justify-center gap-6 overflow-hidden py-20"
      >
        <SystemsIndex />
      </section>

      <section
        id="chapter-skills"
        className="relative flex min-h-screen flex-col justify-center gap-16 overflow-hidden py-20"
      >
        <Skills />
        <Education />
        <Leadership />
      </section>
    </>
  );
}
