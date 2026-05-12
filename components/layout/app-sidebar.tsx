"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookmarkIcon, CollectionIcon, LibraryIcon, ProgressIcon, SettingsIcon, SparkleIcon } from "@/components/ui/icons";

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
  const email = userEmail ?? "reader@private.library";
  const nameSeed = email.split("@")[0] || "reader";
  const displayName = nameSeed
    .split(/[._-]/g)
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase() + chunk.slice(1))
    .join(" ");
  const initials = nameSeed
    .split(/[._-]/g)
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase())
    .join("");

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
          <article className="rounded-3xl border border-[var(--line)] bg-[var(--paper)]/90 p-3 shadow-[0_10px_26px_rgba(20,20,16,0.08)]">
            <div className="flex items-center gap-3">
              <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-sm font-semibold text-[var(--accent-dark)]">
                {initials || "R"}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Welcome Back</p>
                <p className="truncate text-sm font-medium text-[var(--text-main)]">{displayName || "Reader"}</p>
                <p className="truncate text-xs text-[var(--text-soft)]">{email}</p>
              </div>
            </div>
          </article>
        )}
      </div>

      <nav className={`flex-1 space-y-2 ${isReaderMode ? "w-full px-1.5" : "px-4"}`}>
        <Link className="sidebar-link" data-active={isActive(pathname, "/library")} href="/library">
          <LibraryIcon className="size-4" />
          {isReaderMode ? null : <span>Learning Library</span>}
        </Link>
        <Link className="sidebar-link" data-active={pathname === "/library"} href="/library#continue-learning">
          <SparkleIcon className="size-4" />
          {isReaderMode ? null : <span>Continue Learning</span>}
        </Link>
        <Link className="sidebar-link" data-active={pathname === "/library"} href="/library#learning-collections">
          <CollectionIcon className="size-4" />
          {isReaderMode ? null : <span>Collections</span>}
        </Link>
        <Link className="sidebar-link" data-active={pathname === "/library"} href="/library?status=in_progress">
          <BookmarkIcon className="size-4" />
          {isReaderMode ? null : <span>Saved</span>}
        </Link>
        <Link className="sidebar-link" data-active={isActive(pathname, "/progress")} href="/progress">
          <ProgressIcon className="size-4" />
          {isReaderMode ? null : <span>Study Progress</span>}
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
        {isReaderMode ? "•" : "Secure Reader · Learning Library"}
      </div>
    </aside>
  );
}
