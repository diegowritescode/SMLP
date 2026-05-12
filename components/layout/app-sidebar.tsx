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
  const isReaderMode = pathname.includes("/chapters/");

  return (
    <aside
      className={`hidden h-full flex-col border-r border-[var(--line)] bg-[var(--sidebar-surface)]/90 backdrop-blur-xl md:flex ${
        isReaderMode ? "items-center px-2 py-4" : ""
      }`}
    >
      <div className={isReaderMode ? "pb-2 pt-1" : "p-5"}>
        {isReaderMode ? (
          <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">Read</p>
        ) : (
          <>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Private Library</p>
            <p className="mt-2 line-clamp-2 text-sm text-[var(--text-soft)]">{userEmail}</p>
          </>
        )}
      </div>

      <nav className={`flex-1 space-y-2 ${isReaderMode ? "w-full px-1.5" : "px-4"}`}>
        <Link className="sidebar-link" data-active={isActive(pathname, "/library")} href="/library">
          <LibraryIcon className="size-4" />
          {isReaderMode ? null : <span>Library</span>}
        </Link>
        <Link className="sidebar-link" data-active={isActive(pathname, "/progress")} href="/progress">
          <ProgressIcon className="size-4" />
          {isReaderMode ? null : <span>Progress</span>}
        </Link>
        <Link className="sidebar-link" data-active={isActive(pathname, "/settings")} href="/settings">
          <SettingsIcon className="size-4" />
          {isReaderMode ? null : <span>Settings</span>}
        </Link>
        {isAdmin ? (
          <Link className="sidebar-link" data-active={isActive(pathname, "/admin")} href="/admin">
            <span className="inline-block size-4 rounded-full border border-[var(--line)] text-center text-[10px] leading-[14px]">A</span>
            {isReaderMode ? null : <span>Admin</span>}
          </Link>
        ) : null}
      </nav>

      <div className={isReaderMode ? "pb-2 text-[10px] text-[var(--text-muted)]" : "p-4 text-[11px] text-[var(--text-muted)]"}>
        {isReaderMode ? "•" : "Kindle style reader"}
      </div>
    </aside>
  );
}
