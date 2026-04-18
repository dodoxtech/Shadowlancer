import Link from "next/link";

const footerLinks = [
  { label: "Terms", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "Support", href: "#" },
  { label: "Docs", href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-surface-container-low dark:bg-slate-900 w-full py-12">
      <div className="flex flex-col md:flex-row justify-between items-center px-12 gap-6 max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <span className="font-headline font-black text-[#1A1A1A] dark:text-slate-100 text-xl">
            Shadowlancer
          </span>
          <p className="font-body text-xs tracking-wide uppercase text-primary dark:text-slate-300">
            © 2024 Shadowlancer Digital. The Digital Shadowlancer.
          </p>
        </div>
        <nav className="flex gap-8">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-body text-xs tracking-wide uppercase text-on-surface-variant dark:text-slate-500 hover:text-primary underline underline-offset-4 transition-opacity opacity-100 hover:opacity-80"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
