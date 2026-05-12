"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LibraryIcon, ProgressIcon, SettingsIcon } from "@/components/ui/icons";

interface AppSidebarProps {
  isAdmin: boolean;
  userEmail: string | null;
}

function isActive(pathname: string, href: string) {
  if (href === "/library") return pathname === "/library" || pathname.startsWith("/books/");
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppSidebar({ isAdmin, userEmail }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden h-full flex-col border-r border-[var(--line)] bg-[var(--sidebar-surface)] backdrop-blur-xl md:flex">
      <div className="p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Private Library</p>
        <p className="mt-2 line-clamp-2 text-sm text-[var(--text-soft)]">{userEmail}</p>
      </div>

      <nav className="flex-1 space-y-2 px-4">
        <Link className="sidebar-link" data-active={isActive(pathname, "/library")} href="/library">
          <LibraryIcon className="size-4" />
          <span>Library</span>
        </Link>
        <Link className="sidebar-link" data-active={isActive(pathname, "/progress")} href="/progress">
          <ProgressIcon className="size-4" />
          <span>Progress</span>
        </Link>
        <Link className="sidebar-link" data-active={isActive(pathname, "/settings")} href="/settings">
          <SettingsIcon className="size-4" />
          <span>Settings</span>
        </Link>
        {isAdmin ? (
          <Link className="sidebar-link" data-active={isActive(pathname, "/admin")} href="/admin">
            <span className="inline-block size-4 rounded-full border border-[var(--line)] text-center text-[10px] leading-[14px]">A</span>
            <span>Admin</span>
          </Link>
        ) : null}
      </nav>

      <div className="p-4 text-[11px] text-[var(--text-muted)]">Kindle style reader</div>
    </aside>
  );
}
