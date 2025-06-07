CREATE TYPE "public"."skin_concerns" AS ENUM('acne', 'wrinkles', 'dark_spots', 'redness', 'dryness', 'oily_skin', 'sensitivity', 'puffiness', 'dark_circles', 'enlarged_pores', 'dullness', 'uneven_skin_tone', 'blackheads', 'whiteheads', 'rosacea', 'eczema', 'psoriasis', 'sun_damage', 'hyperpigmentation', 'melasma', 'other');--> statement-breakpoint
CREATE TYPE "public"."skin_goals" AS ENUM('hydration', 'anti-aging', 'acne_control', 'brightening', 'even_skin_tone', 'sensitivity_relief', 'pore_minimization', 'oil_control', 'redness_reduction', 'dark_circle_reduction', 'puffiness_reduction', 'skin_texture_improvement', 'dark_spot_correction', 'wrinkle_reduction', 'skin_tightening', 'radiance_boost', 'skin_rejuvenation', 'skin_smoothing', 'skin_nourishment', 'skin_clarity', 'skin_balancing', 'skin_protection', 'other');--> statement-breakpoint
CREATE TYPE "public"."skin_type" AS ENUM('normal', 'dry', 'oily', 'combination', 'sensitive');--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "age" integer;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "skin_type" "skin_type" DEFAULT 'normal';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "skin_concerns" "skin_concerns"[] DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "skin_goals" "skin_goals"[] DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "allergies" text[] DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "current_spend" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "other_info" text DEFAULT '';