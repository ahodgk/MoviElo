CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"is_admin" boolean DEFAULT false NOT NULL,
	"avatar_url" text,
	"first_name" text NOT NULL,
	"last_name" text,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"avatar" text,
	CONSTRAINT "user_id_unique" UNIQUE("id")
);
