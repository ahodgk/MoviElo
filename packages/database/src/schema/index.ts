import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  foreignKey,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

const timestamps = {
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date()),
  createdAt: timestamp().defaultNow().notNull(),
  deletedAt: timestamp(),
};

const id = () => uuid().primaryKey().notNull().unique().defaultRandom();
export const skinTypeEnum = pgEnum("skin_type", [
  "normal",
  "dry",
  "oily",
  "combination",
  "sensitive",
]);

export const skinConcernsEnum = pgEnum("skin_concerns", [
  "acne",
  "wrinkles",
  "dark_spots",
  "redness",
  "dryness",
  "oily_skin",
  "sensitivity",
  "puffiness",
  "dark_circles",
  "enlarged_pores",
  "dullness",
  "uneven_skin_tone",
  "blackheads",
  "whiteheads",
  "rosacea",
  "eczema",
  "psoriasis",
  "sun_damage",
  "hyperpigmentation",
  "melasma",
  "other",
]);

export const skinGoalsEnum = pgEnum("skin_goals", [
  "hydration",
  "anti-aging",
  "acne_control",
  "brightening",
  "even_skin_tone",
  "sensitivity_relief",
  "pore_minimization",
  "oil_control",
  "redness_reduction",
  "dark_circle_reduction",
  "puffiness_reduction",
  "skin_texture_improvement",
  "dark_spot_correction",
  "wrinkle_reduction",
  "skin_tightening",
  "radiance_boost",
  "skin_rejuvenation",
  "skin_smoothing",
  "skin_nourishment",
  "skin_clarity",
  "skin_balancing",
  "skin_protection",
  "other",
]);


// as much as possible of this should be optional, as supabase will auto create one on signup
export const userProfile = pgTable("user", {
  id: id(),
  isAdmin: boolean().default(false).notNull(),

  avatarUrl: text(),

  firstName: text().notNull(),
  lastName: text(),

  age: integer(),

  skinType: skinTypeEnum().default("normal"),
  skinConcerns: skinConcernsEnum().array().default([]),
  skinGoals: skinGoalsEnum().array().default([]),

  allergies: text().array().default([]),

  currentSpend: integer().default(0).notNull(),

  otherInfo: text().default(""),


  avatar: text(),
  ...timestamps,
});
