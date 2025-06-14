import { count, eq, movieList } from "@repo/database";
import { createInsertSchema } from "@repo/database/zod";
import { createServerFn } from "@tanstack/react-start";
import { db } from "~/lib/db";
import { protectMiddleware } from "~/lib/middleware/auth";

export const createListFn = createServerFn({ method: "POST" })
  .middleware([protectMiddleware])
  .validator(createInsertSchema(movieList).partial())
  .handler(async ({ context, data }) => {
    const user = context.user;


    const newList = await db
      .insert(movieList)
      .values({
        ...data,
        userId: user.id,
        name: data.name || `New List ${await getUserListCount(user.id) + 1}`,
      })
      .returning();



    return newList[0];
  });

  const getUserListCount = async (userId: string) => (
          await db
            .select({ count: count(movieList.id) })
            .from(movieList)
            .where(eq(movieList.userId, userId))
        )[0]?.count || 0;