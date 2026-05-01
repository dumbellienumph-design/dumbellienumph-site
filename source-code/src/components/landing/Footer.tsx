export const Footer = () => {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="container-tight flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
        <div className="flex items-center gap-2 font-display font-bold">
          <span className="h-2 w-2 rounded-full bg-primary" />
          FIELDAI<span className="text-primary">.</span>
        </div>
        <div className="font-mono text-xs uppercase tracking-widest">
          © {new Date().getFullYear()} FieldAI — Built in South Africa
        </div>
      </div>
    </footer>
  );
};
