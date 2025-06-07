import { eq, userProfile } from "@repo/database";
import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { getSupabaseServerClient } from "~/utils/supabase";
import { db } from "../db";

// this is redefined here as a hack to make vinxi less retarted
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

export const injectUserMiddleware = createMiddleware().server(
  async ({ next, data, context }) => {
    const user = await fetchUser();
    return next({
      context: {
        user: user,
        middle: "ware",
      },
    });
  },
);

export const checkAdminMiddleware = createMiddleware()
  .middleware([injectUserMiddleware])
  .server(async ({ next, data, context }) => {
    if (!context.user) {
      throw new Error("Not authenticated");
    }
    if (!context.user.isAdmin) {
      throw new Error("Not authorized");
    }
    return next({
      context: {
        user: context.user,
        protected: true,
      },
    });
  });

export const protectMiddleware = createMiddleware()
  // only exists for types
  .middleware([injectUserMiddleware])
  .server(async ({ next, data, context }) => {
    if (!context.user) {
      throw new Error("Not authenticated");
    }
    return next({
      context: {
        user: context.user,
        protected: true,
      },
    });
  });
