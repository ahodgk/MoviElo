import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSupabaseServerClient } from "~/utils/supabase";

const resetPasswordBodySchema = z.object({
  email: z.string().email(),
});

export const resetPasswordFn = createServerFn({ method: "POST" })
  .validator(resetPasswordBodySchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    await supabase.auth.resetPasswordForEmail(data.email);
  });
