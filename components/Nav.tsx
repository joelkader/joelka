import Link from "next/link";

export default function Nav() {
  return (
    <nav className="nav">
      <span className="brand">⚽ WC 2026 POOL</span>
      <Link href="/">Leaderboard</Link>
      <Link href="/schedule">Schedule</Link>
      <Link href="/player">My Teams</Link>
      <Link href="/admin">Admin</Link>
    </nav>
  );
}
