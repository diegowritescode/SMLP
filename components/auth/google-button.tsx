interface GoogleButtonProps {
  label?: string;
}

export function GoogleButton({ label = "Continue with Google" }: GoogleButtonProps) {
  return (
    <button
      type="submit"
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-[#d8d8d2] bg-white px-4 text-sm font-medium text-[#141414] transition hover:border-[#cfcfc8]"
    >
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
        <path
          fill="#EA4335"
          d="M12 10.2v3.9h5.5c-.24 1.25-.95 2.31-2 3.03l3.23 2.5c1.88-1.73 2.97-4.28 2.97-7.3 0-.7-.06-1.37-.18-2.03H12Z"
        />
        <path
          fill="#34A853"
          d="M12 22c2.7 0 4.97-.9 6.63-2.43l-3.23-2.5c-.9.6-2.04.97-3.4.97-2.62 0-4.84-1.77-5.63-4.15l-3.34 2.58A10 10 0 0 0 12 22Z"
        />
        <path
          fill="#4A90E2"
          d="M6.37 13.89A5.99 5.99 0 0 1 6.06 12c0-.66.12-1.3.32-1.89l-3.34-2.58A10 10 0 0 0 2 12c0 1.61.39 3.14 1.08 4.47l3.29-2.58Z"
        />
        <path
          fill="#FBBC05"
          d="M12 5.96c1.47 0 2.78.5 3.82 1.47l2.86-2.86C16.96 3 14.7 2 12 2 8.12 2 4.8 4.2 3.08 7.42l3.34 2.58C7.16 7.73 9.38 5.96 12 5.96Z"
        />
      </svg>
      {label}
    </button>
  );
}
