import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSupabaseServerClient } from "~/utils/supabase";

export const loginBodySchema = z.object({
  email: z.string(),
  password: z.string(),
  redirectUrl: z.string().optional(),
});

export const loginFn = createServerFn({ method: "POST" })
  .validator(loginBodySchema)
  .handler(async ({ data }) => {
    const supabase = await getSupabaseServerClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) {
      throw new Error(error.message);
    }

    // Redirect to the prev page stored in the "redirect" search param
    throw redirect({
      href: data.redirectUrl || "/dashboard",
      reloadDocument: true,
    });
  });
