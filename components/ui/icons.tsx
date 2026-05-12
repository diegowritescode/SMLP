import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function BaseIcon({ children, className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function LibraryIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4 6.5c0-.8.7-1.5 1.5-1.5h12A1.5 1.5 0 0 1 19 6.5v11A1.5 1.5 0 0 1 17.5 19h-12A1.5 1.5 0 0 1 4 17.5v-11Z" />
      <path d="M8 5v14" />
      <path d="M11 8.5h5" />
      <path d="M11 12h5" />
    </BaseIcon>
  );
}

export function ProgressIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M5 18.5h14" />
      <path d="M7.5 15V10" />
      <path d="M12 15V6.5" />
      <path d="M16.5 15v-3.5" />
    </BaseIcon>
  );
}

export function SettingsIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a1 1 0 0 1 0 1.4l-1 1a1 1 0 0 1-1.4 0l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-.2a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a1 1 0 0 1-1.4 0l-1-1a1 1 0 0 1 0-1.4l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h.2a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a1 1 0 0 1 0-1.4l1-1a1 1 0 0 1 1.4 0l.1.1a1 1 0 0 0 1.1.2 1 1 0 0 0 .6-.9V4a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v.2a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a1 1 0 0 1 1.4 0l1 1a1 1 0 0 1 0 1.4l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6H20a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-.2a1 1 0 0 0-.4.1" />
    </BaseIcon>
  );
}

export function LogoutIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M10 17.5H6.5A1.5 1.5 0 0 1 5 16V8a1.5 1.5 0 0 1 1.5-1.5H10" />
      <path d="M14 16l5-4-5-4" />
      <path d="M9 12h10" />
    </BaseIcon>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-4.2-4.2" />
    </BaseIcon>
  );
}

export function FilterIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4 6.5h16" />
      <path d="M7 12h10" />
      <path d="M10 17.5h4" />
    </BaseIcon>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m14.5 5.5-7 6.5 7 6.5" />
    </BaseIcon>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m9.5 5.5 7 6.5-7 6.5" />
    </BaseIcon>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m5.5 12.5 4 4 9-9" />
    </BaseIcon>
  );
}

export function TocIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M5 7h2" />
      <path d="M5 12h2" />
      <path d="M5 17h2" />
      <path d="M10 7h9" />
      <path d="M10 12h9" />
      <path d="M10 17h9" />
    </BaseIcon>
  );
}

export function TypeIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M5 6h14" />
      <path d="M8.5 6v12" />
      <path d="M15.5 6v12" />
      <path d="M7 18h10" />
    </BaseIcon>
  );
}

export function GridIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="4.5" y="4.5" width="6.5" height="6.5" rx="1" />
      <rect x="13" y="4.5" width="6.5" height="6.5" rx="1" />
      <rect x="4.5" y="13" width="6.5" height="6.5" rx="1" />
      <rect x="13" y="13" width="6.5" height="6.5" rx="1" />
    </BaseIcon>
  );
}
