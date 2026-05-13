interface FeedbackBannerProps {
  type: "success" | "error" | "info";
  message: string;
}

const styles = {
  success: "border-[var(--line)] bg-[var(--surface)] text-[var(--success)]",
  error: "border-[var(--line)] bg-[var(--surface)] text-[var(--danger)]",
  info: "border-[var(--line)] bg-[var(--surface)] text-[var(--text-soft)]",
};

export function FeedbackBanner({ type, message }: FeedbackBannerProps) {
  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm shadow-[0_8px_20px_rgba(20,20,16,0.05)] ${styles[type]}`} role="status" aria-live="polite">
      {message}
    </div>
  );
}
