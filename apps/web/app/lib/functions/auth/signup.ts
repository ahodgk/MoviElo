import { userProfile } from "@repo/database";
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getHeaders } from "@tanstack/react-start/server";
import { z } from "zod";
import { db } from "~/lib/db";
import { getSupabaseServerClient } from "~/utils/supabase";
export const signupBodySchema = z.object({
  email: z.string(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string().optional(),
  redirectUrl: z.string().optional(),
});

// const signupBodySchema = createInsertSchema(userProfile);

export const signupFn = createServerFn({ method: "POST" })
  .validator(signupBodySchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const authresponse = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (authresponse.error) {
      throw new Error(authresponse.error.message);
    }

    const id = authresponse.data.user?.id;

    if (!id) {
      throw new Error("User ID not found");
    }

    await db.insert(userProfile).values({
      id,
      firstName: data.firstName,
      lastName: data.lastName,
    });
    // await prisma.user.create({ data: { id } });

    // Redirect to the prev page stored in the "redirect" search param
    throw redirect({
      href: data.redirectUrl || "/profile-setup",
      reloadDocument: true,
    });
  });

export const signupWithGoogleFn = createServerFn({ method: "POST" }).handler(
  async ({ _data }) => {
    const supabase = getSupabaseServerClient();
    const headers = getHeaders();
    const host = headers.host;
    const protocol = headers["x-forwarded-proto"] || "http";
    const redirectUrl = `${protocol}://${host}/api/auth/callback`;

    const authresponse = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (authresponse.error) {
      throw new Error(authresponse.error.message);
    }

    // Redirect to Google consent page
    throw redirect({
      href: authresponse.data.url,
    });
  },
);

export const exchangeGoogleCodeFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      code: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const authresponse = await supabase.auth.signInWithIdToken({
      provider: "google",
      token: data.code,
    });

    if (authresponse.error) {
      throw new Error(authresponse.error.message);
    }
  });
