import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function Nav() {
  return (
    <nav className="nav">
      <span className="brand">⚽ WC 2026 POOL</span>
      <Link href="/">Leaderboard</Link>
      <Link href="/schedule">Schedule</Link>
      <Link href="/player">My Teams</Link>
      <Link href="/admin">Admin</Link>
      <span className="nav-spacer" />
      <ThemeToggle />
    </nav>
  );
}
