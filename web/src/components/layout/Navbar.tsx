"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Icon } from "@/components/ui/Icon";
import type { NavItem } from "@/types";

interface NavbarProps {
  navItems?: NavItem[];
  showUserProfile?: boolean;
  userAvatarSrc?: string;
}

const defaultNavItems: NavItem[] = [
  { label: "Jobs", href: "/dashboard" },
  { label: "Earnings", href: "#" },
  { label: "Messages", href: "#" },
];

export function Navbar({
  navItems = defaultNavItems,
  showUserProfile = false,
  userAvatarSrc,
}: NavbarProps) {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface dark:bg-slate-950 h-20">
      <div className="flex justify-between items-center px-8 h-full max-w-[1440px] mx-auto relative">
        <div className="flex items-center gap-12">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tighter text-[#1A1A1A] dark:text-slate-100 font-headline"
          >
            Sanctuary
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={
                  item.active
                    ? "text-[#1A1A1A] dark:text-white font-semibold border-b-2 border-primary pb-1 font-body text-sm transition-colors duration-200"
                    : "text-on-surface-variant dark:text-slate-400 font-medium font-body text-sm hover:text-[#1A1A1A] dark:hover:text-white transition-colors duration-200"
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          {!showUserProfile && (
            <button className="cursor-pointer p-2 scale-95 active:opacity-80 transition-all">
              <Icon name="notifications" className="text-primary dark:text-slate-200" />
            </button>
          )}
          <ConnectButton
            chainStatus="icon"
            showBalance={false}
            accountStatus="avatar"
          />
          {showUserProfile && (
            <div className="flex items-center gap-4 text-primary dark:text-slate-200">
              <Icon name="notifications" className="cursor-pointer hover:text-[#1A1A1A] transition-colors" />
              {userAvatarSrc && (
                <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={userAvatarSrc}
                    alt="User profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-surface-container dark:bg-slate-900 h-[1px] w-full absolute bottom-0 left-0" />
      </div>
    </header>
  );
}
