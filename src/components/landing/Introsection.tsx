export default function IntroSection() {
  return (
    <section id="learn" className="mx-auto max-w-[90rem] px-5 py-28 md:px-10 md:py-44">
      <h2 className="max-w-6xl font-[family-name:var(--font-display)] text-[clamp(2.75rem,8vw,8rem)] leading-[1] tracking-[-0.03em]">
        Modern software development is a journey.
      </h2>
      <div className="mt-16 grid gap-8 md:mt-24 md:grid-cols-12">
        <div className="hidden md:col-span-5 md:block">
          <div className="h-full min-h-24 w-px bg-[var(--brand)]" aria-hidden="true" />
        </div>
        <div className="space-y-6 text-lg leading-relaxed md:col-span-7 md:text-xl lg:max-w-xl">
          <p className="font-medium">Technology continues to expand.</p>
          <p className="text-[var(--muted)]">
            The platform organizes the journey into clear stages so learners can understand what to learn, why it matters, and what to build next.
          </p>
        </div>
      </div>
    </section>
  );
}