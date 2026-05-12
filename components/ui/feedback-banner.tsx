interface FeedbackBannerProps {
  type: "success" | "error" | "info";
  message: string;
}

const styles = {
  success:
    "border-[var(--border-soft)] bg-[color:var(--surface-muted)] text-[var(--success)]",
  error:
    "border-[var(--border-soft)] bg-[color:var(--surface-muted)] text-[var(--danger)]",
  info:
    "border-[var(--border-soft)] bg-[color:var(--surface-muted)] text-[var(--text-secondary)]",
};

export function FeedbackBanner({ type, message }: FeedbackBannerProps) {
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${styles[type]}`} role="status" aria-live="polite">
      {message}
    </div>
  );
}
