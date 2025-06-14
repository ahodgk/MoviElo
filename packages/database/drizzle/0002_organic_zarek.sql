ALTER TABLE "movie_list_item" RENAME COLUMN "tmbd_id" TO "tmdb_id";--> statement-breakpoint
ALTER TABLE "movie_list_comparison_history" DROP CONSTRAINT "movie_list_comparison_history_movie_list_id_winning_movie_list_item_id_movie_list_item_movie_list_id_tmbd_id_fk";
--> statement-breakpoint
ALTER TABLE "movie_list_comparison_history" DROP CONSTRAINT "movie_list_comparison_history_movie_list_id_losing_movie_list_item_id_movie_list_item_movie_list_id_tmbd_id_fk";
--> statement-breakpoint
ALTER TABLE "movie_list_item" DROP CONSTRAINT "movie_list_item_tmbd_id_movie_list_id_pk";--> statement-breakpoint
ALTER TABLE "movie_list_item" ADD CONSTRAINT "movie_list_item_tmdb_id_movie_list_id_pk" PRIMARY KEY("tmdb_id","movie_list_id");--> statement-breakpoint
ALTER TABLE "movie_list_item" ADD COLUMN "user_id" uuid;--> statement-breakpoint
ALTER TABLE "movie_list_comparison_history" ADD CONSTRAINT "movie_list_comparison_history_movie_list_id_winning_movie_list_item_id_movie_list_item_movie_list_id_tmdb_id_fk" FOREIGN KEY ("movie_list_id","winning_movie_list_item_id") REFERENCES "public"."movie_list_item"("movie_list_id","tmdb_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "movie_list_comparison_history" ADD CONSTRAINT "movie_list_comparison_history_movie_list_id_losing_movie_list_item_id_movie_list_item_movie_list_id_tmdb_id_fk" FOREIGN KEY ("movie_list_id","losing_movie_list_item_id") REFERENCES "public"."movie_list_item"("movie_list_id","tmdb_id") ON DELETE cascade ON UPDATE cascade;