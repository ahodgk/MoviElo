CREATE TABLE "movie_list" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"user_id" uuid NOT NULL,
	"initial_k" integer DEFAULT 1500 NOT NULL,
	"tuning_factor" integer DEFAULT 32 NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "movie_list_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "movie_list_comparison_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"movie_list_id" uuid,
	"winning_movie_list_item_id" text,
	"losing_movie_list_item_id" text,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "movie_list_comparison_history_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "movie_list_item" (
	"tmbd_id" text NOT NULL,
	"movie_list_id" uuid,
	"current_elo" integer DEFAULT 1500 NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "movie_list_item_tmbd_id_movie_list_id_pk" PRIMARY KEY("tmbd_id","movie_list_id")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"is_admin" boolean DEFAULT false NOT NULL,
	"avatar_url" text,
	"first_name" text NOT NULL,
	"last_name" text,
	"avatar" text,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "movie_list" ADD CONSTRAINT "movie_list_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "movie_list_comparison_history" ADD CONSTRAINT "movie_list_comparison_history_movie_list_id_movie_list_id_fk" FOREIGN KEY ("movie_list_id") REFERENCES "public"."movie_list"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "movie_list_comparison_history" ADD CONSTRAINT "movie_list_comparison_history_movie_list_id_winning_movie_list_item_id_movie_list_item_movie_list_id_tmbd_id_fk" FOREIGN KEY ("movie_list_id","winning_movie_list_item_id") REFERENCES "public"."movie_list_item"("movie_list_id","tmbd_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "movie_list_comparison_history" ADD CONSTRAINT "movie_list_comparison_history_movie_list_id_losing_movie_list_item_id_movie_list_item_movie_list_id_tmbd_id_fk" FOREIGN KEY ("movie_list_id","losing_movie_list_item_id") REFERENCES "public"."movie_list_item"("movie_list_id","tmbd_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "movie_list_item" ADD CONSTRAINT "movie_list_item_movie_list_id_movie_list_id_fk" FOREIGN KEY ("movie_list_id") REFERENCES "public"."movie_list"("id") ON DELETE cascade ON UPDATE cascade;