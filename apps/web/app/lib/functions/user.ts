import { eq, movieList, userProfile } from "@repo/database";
import { createUpdateSchema } from "@repo/database/zod";
import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServerClient } from "~/utils/supabase";
import { db } from "../db";
import { protectMiddleware } from "../middleware/auth";

export const fetchUser = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return null;
  }

  const users = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.id, data.user.id));

  let user = users[0];
  if (!user) {
    user = (
      await db
        .insert(userProfile)
        .values({
          id: data.user.id,
          firstName: "",
        })
        .returning()
    )[0];
  }

  // todo join to profile table
  return {
    email: data.user.email,
    // id: data.user.id,
    // name: data.user.email,
    name: user?.firstName,
    ...user,
  };
});

export const setUserProfileFn = createServerFn({ method: "POST" })
  .middleware([protectMiddleware])
  .validator(
    createUpdateSchema(userProfile).pick({
      avatarUrl: true,

      firstName: true,
      lastName: true,
    })
  )
  .handler(async ({ data, context }) => {
    const { user } = context;

    await db
      .update(userProfile)
      .set({
        ...data,
        id: user.id,
      })
      .where(eq(userProfile.id, user.id))
      .returning();
    return data;
  });

export const deleteUserFn = createServerFn({ method: "POST" })
  .middleware([protectMiddleware])
  .handler(async ({ context }) => {
    const supabase = getSupabaseServerClient();
    const r = await supabase.auth.admin.deleteUser(context.user.id, true);
    if (r.error) {
      throw new Error(r.error.message);
    }
    return { success: true };
  });
