import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import type { Job } from "@/types";

interface JobsListProps {
  jobs: Job[];
}

export function JobsList({ jobs }: JobsListProps) {
  return (
    <section className="col-span-12 lg:col-span-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-headline text-2xl font-bold">
          Jobs Currently Applied To
        </h2>
        <button className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label text-sm cursor-pointer">
          <Icon name="search" className="text-lg" />
          Command Palette
        </button>
      </div>

      <div className="space-y-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="group bg-surface-container-low hover:bg-surface-container transition-all duration-300 p-8 rounded-xl flex items-center justify-between"
          >
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-surface-container-lowest rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={job.icon} className="text-primary text-3xl" />
              </div>
              <div>
                <h3 className="font-headline font-bold text-lg">{job.title}</h3>
                <p className="font-body text-sm text-on-surface-variant">
                  {job.company} • Applied {job.appliedAgo}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-right">
                <span className="block font-headline font-bold text-lg">
                  {job.price}
                </span>
                <span className="text-xs uppercase font-label tracking-tighter text-on-surface-variant">
                  {job.pricingType}
                </span>
              </div>
              <Badge label={job.status} status={job.status} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
