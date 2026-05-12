const requiredPublicVars = ["NEXT_PUBLIC_SUPABASE_URL"] as const;

function nonEmpty(value: string | undefined) {
  return value && value.trim().length > 0 ? value : undefined;
}

export function getSupabasePublicEnv() {
  for (const key of requiredPublicVars) {
    if (!process.env[key]) {
      throw new Error(`Missing required env var: ${key}`);
    }
  }

  const anonOrPublishableKey =
    nonEmpty(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ??
    nonEmpty(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

  if (!anonOrPublishableKey) {
    throw new Error(
      "Missing required env var: NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    );
  }

  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    anonKey: anonOrPublishableKey,
  };
}

export function getSupabaseServiceRoleKey() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error("Missing required env var: SUPABASE_SERVICE_ROLE_KEY");
  }
  return key;
}
