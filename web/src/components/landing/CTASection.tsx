import { Button } from "@/components/ui/Button";

export function CTASection() {
  return (
    <section className="py-40 px-8 text-center bg-surface">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter mb-10">
          Ready to find <br />
          your sanctuary?
        </h2>
        <Button size="xl" className="shadow-xl font-bold">
          Start Your Journey
        </Button>
      </div>
    </section>
  );
}
