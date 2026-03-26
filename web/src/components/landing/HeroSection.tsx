import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBswloo4XoZO5CMn1ub6JTmbUDlY_DlkWE2a4QS3Ap12iu0fOIbXboEaLL9szC1xNoMUZLGk-gbyQQ2S7yAqVdmKewNEHPN-FTB3-9b-qlwlSUEJlZQEMwUKE_p7mNM_M9OlXnZRsFf9k0g_eYEEFvPHZ7CLgWNtGymMESphRGlZy4u4fGibxXURxQa-iTI1gqyezubMh_P-iNbY8s6O0HJvi98W1CvIbCdNfe-B1yXGhTPhYJX2VLDr00G6PSoccCZWefBoY2CWz7J";

export function HeroSection() {
  return (
    <section className="min-h-[921px] flex items-center px-8 md:px-24 py-20 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full max-w-[1440px] mx-auto">
        <div className="lg:col-span-7 z-10">
          <h1 className="font-headline text-6xl md:text-8xl font-extrabold tracking-tighter text-on-background leading-[0.9] mb-8">
            The silence <br />
            of deep work.
          </h1>
          <p className="font-body text-xl text-on-surface-variant max-w-md mb-12 leading-relaxed">
            A curated Web3 ecosystem for the high-end freelancer. No noise,
            just focus.
          </p>
          <div className="flex items-center gap-6">
            <Button size="lg">Start Your Journey</Button>
            <Button variant="ghost" size="lg" className="group">
              Explore Jobs
              <Icon
                name="arrow_forward"
                className="group-hover:translate-x-1 transition-transform"
              />
            </Button>
          </div>
        </div>

        <div className="lg:col-span-5 relative h-[600px]">
          <div className="absolute inset-0 bg-surface-container-low rounded-full scale-110 -z-10 blur-3xl opacity-50" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HERO_IMAGE}
            alt="Minimalist architectural void with soft shadows and neutral stone textures"
            className="w-full h-full object-cover rounded-xl shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000"
          />
        </div>
      </div>
    </section>
  );
}
