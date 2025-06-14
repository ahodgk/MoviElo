import { eq, userProfile } from "@repo/database";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { db } from "~/lib/db";
import { getSupabaseServerClient } from "~/utils/supabase";

export const APIRoute = createAPIFileRoute("/api/auth/callback")({
  GET: async ({ request, params }) => {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const next = url.searchParams.get("next") || "/dashboard";

    if (!code) {
      throw new Error("No code provided");
    }

    const supabase = getSupabaseServerClient();
    const authresponse = await supabase.auth.exchangeCodeForSession(code);

    if (authresponse.error) {
      throw new Error(authresponse.error.message);
    }

    const profile = await db.query.userProfile.findFirst({
      where: eq(userProfile.id, authresponse.data.session?.user.id),
    });

    // Returning user
    if (profile) {
      return new Response("Success", {
        status: 302,
        headers: {
          Location: next,
        },
      });
    }

    // New user
    const user = authresponse.data.session?.user;
    const first_name = user.user_metadata.name.split(" ")[0] || "";
    const last_name = user.user_metadata.name.split(" ")[1] || "";

    await db.insert(userProfile).values({
      id: authresponse.data.session?.user.id,
      firstName: first_name,
      lastName: last_name,
    });

    return new Response("Success", {
      status: 302,
      headers: {
        Location: "/profile-setup",
      },
    });
  },
});
