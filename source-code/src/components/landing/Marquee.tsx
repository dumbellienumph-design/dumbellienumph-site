const items = [
  "WhatsApp",
  "Instagram",
  "Facebook",
  "TikTok",
  "Google Business",
  "Web Chat",
  "Email",
  "SMS",
];

export const Marquee = () => {
  return (
    <section className="relative overflow-hidden border-y border-border/60 bg-background/40 py-8">
      <div className="relative flex">
        <div className="marquee shrink-0">
          {[...items, ...items].map((t, i) => (
            <div key={i} className="flex items-center gap-4 whitespace-nowrap">
              <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
              <span className="font-display text-2xl font-semibold text-muted-foreground/70 md:text-3xl">
                {t}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent" />
    </section>
  );
};
