import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { JobsList } from "@/components/dashboard/JobsList";
import { EarningsCard } from "@/components/dashboard/EarningsCard";
import { MessagesCard } from "@/components/dashboard/MessagesCard";
import type { Job, Message, NavItem } from "@/types";

const USER_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCz3WheLXjPXJ7P38vrUmzKEYSlWSEzzLhjbVm94HX0VpOixpW4T5CY9dyAKqoJ8KffPGwl2dYsvHjfO2zumTA8BqAKxnWW-RmhTjJh7vVyDf-6wqqL1hLiWZRuQUZF-DziH8omyZPulcD63XGTADhKDRIub3MNHD28YyfZs88OJXMO8RwMulj7g1bASwvDvIWyXbHmbl-LO-Il2j-GmGhkYK33PGiH05p152uWzML3h5NMop7kMtYET2RKkpfT83JAtEmegnM8mmQp";

const dashboardNavItems: NavItem[] = [
  { label: "Jobs", href: "/dashboard", active: true },
  { label: "Earnings", href: "#" },
  { label: "Messages", href: "#" },
];

const appliedJobs: Job[] = [
  {
    id: "1",
    title: "Lead Protocol Designer",
    company: "Nexus Foundry",
    appliedAgo: "2 days ago",
    price: "$12,000",
    pricingType: "Fixed Milestone",
    status: "Under Review",
    icon: "token",
  },
  {
    id: "2",
    title: "Smart Contract Architect",
    company: "Ethereal Systems",
    appliedAgo: "5 days ago",
    price: "$180/hr",
    pricingType: "Hourly Retainer",
    status: "Interviewing",
    icon: "architecture",
  },
  {
    id: "3",
    title: "Creative Strategist",
    company: "Solana Labs",
    appliedAgo: "1 week ago",
    price: "$8,500",
    pricingType: "Bounty Based",
    status: "Closed",
    icon: "palette",
  },
];

const messages: Message[] = [
  {
    id: "1",
    sender: "Sarah Jenkins",
    preview:
      "The protocol designs look incredible, Elias. Can we jump on a quick call tomorrow?",
    time: "14:02",
    avatarSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDwkerI_BhEKAcv1MFIsyP_Ct7jZhFw783t6RHZuGqM4cDk08t5xN8TwxBc76flouW9K3-qJ3rsUwv6cFf3QpMGdEUW0bsleQcWdzo1CqIY3uKNQD1JfBpCgdEvncqd8XHKD2rcNbbTVIelnMCu5jmYQF_aIDriwRgB0M4pmQ1wKr1a-mf_8TA3urwfpP5o_czBwnkwqMc17VEGgUj4y-vx7-bHto81Vxr_cutHInPBdBK69HVKMW7ckwns5M0Iw6_2r-lof_beOGYy",
  },
  {
    id: "2",
    sender: "David Chen",
    preview:
      "I've sent the initial deposit to your Sanctuary wallet. Please confirm receipt.",
    time: "Yesterday",
    avatarSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAZz903fgijinInRdCqhHEFLpBPTihcz4pjQVp12VlNtrqwT30DKe9YK-Yo_CTTMeeoC3ksimW3RsLNC889UKQgQ0QfAuJp5-3ezyoD8kycawri2HN_xFVnGdA5n5dAtMfz_g-irJrmVIMXKuduCqzaNC-TcLprMiG8H-W_f04UrxclRfgawMyak80zG-mIHTsZ7_7qOdtqtUAACYnCHpdJchapBLKdaI-tL_EeJXyK94CzmQ2MdvoqyvZsoO0izQQaZgXVYcJhxKL7",
  },
];

export default function DashboardPage() {
  return (
    <>
      <Navbar
        navItems={dashboardNavItems}
        showUserProfile
        userAvatarSrc={USER_AVATAR}
      />
      <main className="pt-32 pb-20 px-8 max-w-[1440px] mx-auto flex-1">
        <WelcomeHeader userName="Elias" walletBalance="0.842 ETH" />
        <div className="grid grid-cols-12 gap-8">
          <JobsList jobs={appliedJobs} />
          <section className="col-span-12 lg:col-span-4 space-y-8">
            <EarningsCard totalEarnings="$42,890.00" />
            <MessagesCard messages={messages} unreadCount={2} />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
