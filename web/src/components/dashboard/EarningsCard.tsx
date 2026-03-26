import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";

const earningsChart = [
  { height: "h-4" },
  { height: "h-6" },
  { height: "h-10", highlight: true },
  { height: "h-5" },
  { height: "h-8", tertiary: true },
  { height: "h-12", tertiary: true },
  { height: "h-7" },
];

interface EarningsCardProps {
  totalEarnings: string;
}

export function EarningsCard({ totalEarnings }: EarningsCardProps) {
  return (
    <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="font-headline text-lg font-bold mb-1">
            Total Earnings
          </h2>
          <p className="font-body text-xs text-on-surface-variant uppercase tracking-widest">
            Year to date
          </p>
        </div>
        <Icon name="trending_up" className="text-tertiary" />
      </div>

      <div className="mb-10">
        <span className="font-headline text-4xl font-extrabold tracking-tighter">
          {totalEarnings}
        </span>
        <div className="mt-4 flex items-end gap-1 h-12">
          {earningsChart.map((bar, i) => (
            <div
              key={i}
              className={`w-full ${bar.height} rounded-t-sm ${
                bar.tertiary
                  ? "bg-tertiary"
                  : bar.highlight
                  ? "bg-primary"
                  : "bg-surface-container-high"
              }`}
            />
          ))}
        </div>
      </div>

      <Button variant="outline" className="w-full py-3 rounded-lg">
        View Detailed Report
      </Button>
    </div>
  );
}
