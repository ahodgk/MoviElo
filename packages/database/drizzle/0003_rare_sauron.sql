ALTER TABLE "movie_list" ALTER COLUMN "initial_k" SET DEFAULT 20;--> statement-breakpoint
ALTER TABLE "movie_list" ALTER COLUMN "tuning_factor" SET DEFAULT 10;--> statement-breakpoint
ALTER TABLE "movie_list_comparison_history" ADD COLUMN "win_first" boolean;