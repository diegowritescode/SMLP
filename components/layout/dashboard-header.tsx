"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/app/(dashboard)/actions";
import { LibraryIcon, LogoutIcon, ProgressIcon } from "@/components/ui/icons";

interface DashboardHeaderProps {
  userEmail: string;
}

export function DashboardHeader({ userEmail }: DashboardHeaderProps) {
  const pathname = usePathname();

  if (pathname.includes("/chapters/")) {
    return null;
  }

  return (
    <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div className="floating-control flex h-11 min-w-0 items-center gap-2 px-4 text-xs text-[var(--text-soft)]">
        <span className="hidden sm:inline">Private Library</span>
        <span className="sm:hidden">Library</span>
        <span>•</span>
        <span className="truncate">{userEmail}</span>
      </div>

      <div className="flex items-center gap-2">
        <Link href="/library" className="icon-button-soft" aria-label="Library">
          <LibraryIcon className="size-4" />
        </Link>
        <Link href="/progress" className="icon-button-soft" aria-label="Progress">
          <ProgressIcon className="size-4" />
        </Link>
        <form action={signOutAction}>
          <button className="floating-control inline-flex h-11 items-center gap-2 px-4 text-sm text-[var(--text-soft)]" type="submit">
            <LogoutIcon className="size-4" />
            Logout
          </button>
        </form>
      </div>
    </header>
  );
}
