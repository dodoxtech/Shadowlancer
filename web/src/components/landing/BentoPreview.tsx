import { Icon } from "@/components/ui/Icon";

const chartBars = [
  { height: "h-1/2", opacity: "bg-primary/20" },
  { height: "h-3/4", opacity: "bg-primary/40" },
  { height: "h-full", opacity: "bg-primary" },
  { height: "h-2/3", opacity: "bg-primary/60" },
  { height: "h-1/2", opacity: "bg-primary/30" },
];

export function BentoPreview() {
  return (
    <section className="py-32 px-8 bg-surface">
      <div className="max-w-[1440px] mx-auto">
        <div className="mb-20 text-center max-w-2xl mx-auto">
          <h2 className="font-headline text-5xl font-bold tracking-tight mb-6">
            Your private Shadowlancer.
          </h2>
          <p className="font-body text-on-surface-variant">
            A dashboard that understands you. No clutter, just the vitals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
          {/* Total Balance - spans 2 cols and 2 rows */}
          <div className="md:col-span-2 md:row-span-2 bg-surface-container p-8 rounded-xl flex flex-col justify-between overflow-hidden relative">
            <div className="z-10">
              <h3 className="font-headline text-2xl font-bold mb-2">
                Total Balance
              </h3>
              <p className="text-4xl font-headline font-black text-primary">
                12.45 ETH
              </p>
            </div>
            <div className="mt-8 z-10">
              <div className="h-40 w-full bg-surface-container-lowest/50 rounded-lg p-4 flex items-end gap-2">
                {chartBars.map((bar, i) => (
                  <div
                    key={i}
                    className={`w-full ${bar.opacity} ${bar.height} rounded-t-sm`}
                  />
                ))}
              </div>
            </div>
            <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-tertiary/5 blur-3xl rounded-full" />
          </div>

          {/* Active Proposals */}
          <div className="md:col-span-2 bg-surface-container-high p-8 rounded-xl flex items-center justify-between">
            <div>
              <h3 className="font-headline text-xl font-bold mb-1">
                Active Proposals
              </h3>
              <p className="font-body text-on-surface-variant text-sm">
                3 Pending Review
              </p>
            </div>
            <div className="flex -space-x-3">
              <div className="w-12 h-12 rounded-full border-2 border-surface bg-slate-300" />
              <div className="w-12 h-12 rounded-full border-2 border-surface bg-slate-400" />
              <div className="w-12 h-12 rounded-full border-2 border-surface bg-slate-500" />
            </div>
          </div>

          {/* Reputation */}
          <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/10 flex flex-col justify-center">
            <Icon name="verified_user" className="text-tertiary mb-2" />
            <h4 className="font-headline font-bold">Reputation</h4>
            <p className="text-2xl font-bold text-on-surface">98%</p>
          </div>

          {/* New Jobs */}
          <div className="bg-primary text-on-primary p-8 rounded-xl flex flex-col justify-center">
            <Icon name="bolt" className="mb-2" />
            <h4 className="font-headline font-bold">New Jobs</h4>
            <p className="text-2xl font-bold">14 Available</p>
          </div>
        </div>
      </div>
    </section>
  );
}
