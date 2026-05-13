"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LibraryIcon, ProgressIcon, SettingsIcon } from "@/components/ui/icons";

interface MobileNavProps {
  isAdmin: boolean;
}

function isActive(pathname: string, href: string) {
  if (href === "/library") return pathname === "/library" || pathname.startsWith("/books/");
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileNav({ isAdmin }: MobileNavProps) {
  const pathname = usePathname();

  if (pathname.includes("/chapters/")) {
    return null;
  }

  return (
    <nav className="fixed bottom-4 left-1/2 z-40 flex w-[min(92vw,520px)] -translate-x-1/2 items-center justify-around rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2 shadow-[0_10px_26px_rgba(20,20,16,0.12)] backdrop-blur-xl md:hidden">
      <Link className="mobile-nav-link" data-active={isActive(pathname, "/library")} href="/library">
        <LibraryIcon className="size-4.5" />
        Library
      </Link>
      <Link className="mobile-nav-link" data-active={isActive(pathname, "/progress")} href="/progress">
        <ProgressIcon className="size-4.5" />
        Study
      </Link>
      <Link className="mobile-nav-link" data-active={isActive(pathname, "/settings")} href="/settings">
        <SettingsIcon className="size-4.5" />
        Settings
      </Link>
      {isAdmin ? (
        <Link className="mobile-nav-link" data-active={isActive(pathname, "/admin")} href="/admin">
          Admin
        </Link>
      ) : null}
    </nav>
  );
}
