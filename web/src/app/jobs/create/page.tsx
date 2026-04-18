import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CreateJobForm } from "@/components/jobs/CreateJobForm";

export default function CreateJobPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20 px-8 max-w-[1440px] mx-auto flex-1">

        {/* Page header */}
        <div className="mb-10">
          <p className="text-xs font-label font-semibold uppercase tracking-widest text-on-surface-variant mb-2">
            New listing
          </p>
          <h1 className="font-headline font-bold text-4xl tracking-tighter text-on-surface">
            Post a job
          </h1>
          <p className="mt-3 text-on-surface-variant font-body text-sm max-w-lg">
            Your maximum budget is encrypted end-to-end using Fhenix FHE. Freelancers bid without
            ever seeing your ceiling — only the winning bid is revealed.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-12 gap-8">

          {/* Form card */}
          <div className="col-span-12 lg:col-span-7">
            <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-8">
              <CreateJobForm />
            </div>
          </div>

          {/* Sidebar — how it works */}
          <aside className="col-span-12 lg:col-span-4 lg:col-start-9 space-y-4">
            <h2 className="font-headline font-bold text-sm tracking-tight text-on-surface">
              How private bidding works
            </h2>
            {[
              {
                icon: "lock",
                title: "Budget stays hidden",
                body: "Your max budget is FHE-encrypted before it ever leaves your browser. Even the chain cannot read it.",
              },
              {
                icon: "visibility_off",
                title: "Bids are private too",
                body: "Each freelancer's bid is independently encrypted. No bidder can see what others offered.",
              },
              {
                icon: "done_all",
                title: "Fair selection on-chain",
                body: "Fhenix's FHE co-processors compare ciphertexts directly and surface only the winner — nothing else.",
              },
            ].map(({ icon, title, body }) => (
              <div
                key={title}
                className="bg-surface-container-lowest border border-outline-variant/10 rounded-xl p-6 flex gap-4"
              >
                <div className="w-9 h-9 rounded-lg bg-tertiary-container flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-on-tertiary-container text-lg">
                    {icon}
                  </span>
                </div>
                <div>
                  <p className="font-label font-semibold text-sm text-on-surface">{title}</p>
                  <p className="text-xs text-on-surface-variant font-body mt-1 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </aside>

        </div>
      </main>
      <Footer />
    </>
  );
}
