interface WelcomeHeaderProps {
  userName: string;
  walletBalance: string;
}

export function WelcomeHeader({ userName, walletBalance }: WelcomeHeaderProps) {
  return (
    <section className="mb-20 flex flex-col md:flex-row justify-between items-end gap-8">
      <div className="max-w-2xl">
        <h1 className="font-headline text-5xl font-extrabold tracking-tight text-on-surface mb-4">
          Good morning, {userName}.
        </h1>
        <p className="font-body text-lg text-on-surface-variant max-w-md">
          Your digital Shadowlancer is calm. 3 active applications, and your
          wallet is secured.
        </p>
      </div>

      <div className="bg-surface-container-low p-6 rounded-xl flex items-center gap-6 min-w-[320px]">
        <div className="flex flex-col">
          <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-1">
            Wallet Status
          </span>
          <span className="font-headline font-bold text-xl text-primary flex items-center gap-2">
            {walletBalance}
            <span className="w-2 h-2 rounded-full bg-tertiary" />
          </span>
        </div>
        <div className="h-10 w-[1px] bg-outline-variant/30" />
        <button className="text-primary font-label text-sm font-semibold hover:underline cursor-pointer">
          Details
        </button>
      </div>
    </section>
  );
}
