interface FeedbackBannerProps {
  type: "success" | "error" | "info";
  message: string;
}

const styles = {
  success: "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200",
  error: "border-red-300 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200",
  info: "border-sky-300 bg-sky-50 text-sky-800 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-200",
};

export function FeedbackBanner({ type, message }: FeedbackBannerProps) {
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${styles[type]}`} role="status" aria-live="polite">
      {message}
    </div>
  );
}
