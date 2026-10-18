import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

// Landing page for Supabase email links (password reset, etc.). Handles both
// link styles, because this Supabase project is shared with the cash-receiving
// app and its email templates can't be W3-specific:
//  - ?code=...                   default template: Supabase verifies, then redirects
//                                here (PKCE) and we exchange the code for a session
//  - ?token_hash=...&type=...    custom template that links straight here
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = safeNextPath(searchParams.get("next"));

  const supabase = await createClient();
  let ok = false;
  if (code) {
    ok = !(await supabase.auth.exchangeCodeForSession(code)).error;
  } else if (token_hash && type) {
    ok = !(await supabase.auth.verifyOtp({ type, token_hash })).error;
  }

  redirect(ok ? next : "/forgot-password?error=Invalid or expired link");
}

// Only allow same-site relative paths, so the link can't bounce users elsewhere.
function safeNextPath(next: string | null) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/lists";
}
