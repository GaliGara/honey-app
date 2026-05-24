import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import RecentOrders from "@/components/dashboard/recent-orders";
import RewardsCard from "@/components/dashboard/rewards-card";
import SubscriptionCard from "@/components/dashboard/subscription-card";
import ProfileSummary from "@/components/dashboard/profile-summary";
import SavedItems from "@/components/dashboard/saved-items";
import FavoritesPreview from "@/components/dashboard/favorites-preview";

export const metadata: Metadata = {
  title: "Mi cuenta — Honey",
  description: "Tu panel de cliente Honey. Pedidos, recompensas y preferencias.",
};

export default function CuentaPage() {
  return (
    <>
      <Navbar />

      <main className="warm-radial-bg relative min-h-screen pt-28 pb-20 px-4 overflow-hidden">

        {/* Ambient decorations */}
        <div
          aria-hidden
          className="hex-shape absolute pointer-events-none"
          style={{
            width: 360,
            height: 360,
            right: "-80px",
            top: "6%",
            background: "rgba(212,175,55,0.04)",
            transform: "rotate(14deg)",
          }}
        />
        <div
          aria-hidden
          className="hex-shape absolute pointer-events-none"
          style={{
            width: 220,
            height: 220,
            left: "-60px",
            bottom: "10%",
            background: "rgba(184,117,20,0.035)",
            transform: "rotate(-6deg)",
          }}
        />

        <div className="relative max-w-7xl mx-auto">

          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 mb-8 text-[10px] uppercase tracking-[0.28em]"
          >
            <a href="/" style={{ color: "rgba(111,86,53,0.6)" }}>Inicio</a>
            <span style={{ color: "rgba(184,117,20,0.35)" }}>·</span>
            <span style={{ color: "#B87514" }}>Mi cuenta</span>
          </nav>

          {/* ── Layout: sidebar + main ── */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">

            {/* ── Sidebar ── */}
            <div className="w-full lg:w-72 xl:w-80 shrink-0">
              <DashboardSidebar />
            </div>

            {/* ── Main content ── */}
            <div className="flex-1 min-w-0 flex flex-col gap-6">

              {/* Welcome header */}
              <DashboardHeader />

              {/* Row 1: Orders + Rewards */}
              <div className="grid md:grid-cols-2 gap-6">
                <RecentOrders />
                <RewardsCard />
              </div>

              {/* Row 2: Subscription + Profile */}
              <div className="grid md:grid-cols-2 gap-6">
                <SubscriptionCard />
                <ProfileSummary />
              </div>

              {/* Full-width: Saved items */}
              <SavedItems />

              {/* Full-width: Favorites */}
              <FavoritesPreview />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
