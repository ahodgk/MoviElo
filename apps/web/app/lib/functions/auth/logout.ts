import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { getSupabaseServerClient } from "~/utils/supabase";

export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    return {
      error: true,
      message: error.message,
    };
  }

  // Redirect to the prev page stored in the "redirect" search param
  throw redirect({
    href: "/",
    reloadDocument: true,
  });
});
