import { Icon } from "@/components/ui/Icon";

const features = [
  {
    icon: "filter_vintage",
    title: "Reduced Stress",
    description:
      'We eliminate "dark patterns" that trigger FOMO, giving you the space to breathe and choose work that matters.',
  },
  {
    icon: "center_focus_strong",
    title: "Better Focus",
    description:
      "Strategic minimalism means fewer distractions. Our interface fades into the background while you're in the flow.",
  },
];

export function PhilosophySection() {
  return (
    <section className="bg-surface-container-low py-32 px-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-start">
          <div className="space-y-8">
            <span className="font-label text-tertiary tracking-widest uppercase text-xs font-bold">
              The Philosophy
            </span>
            <h2 className="font-headline text-4xl font-bold tracking-tight text-on-surface">
              Designed for serenity, built for results.
            </h2>
            <p className="font-body text-lg text-on-surface-variant leading-relaxed">
              Most platforms thrive on anxiety—constant notifications, bidding
              wars, and cluttered interfaces. Shadowlancer is different. We apply
              &apos;Calm Design&apos; principles to reduce cognitive load and
              prioritize your mental well-being.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-surface-container-lowest p-10 rounded-xl border border-outline-variant/10"
              >
                <Icon
                  name={feature.icon}
                  className="text-4xl text-primary mb-6"
                />
                <h3 className="font-headline text-xl font-bold mb-3">
                  {feature.title}
                </h3>
                <p className="font-body text-sm text-on-surface-variant">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
