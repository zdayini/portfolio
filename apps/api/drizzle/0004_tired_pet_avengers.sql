CREATE TABLE "concert_photos" (
	"id" serial PRIMARY KEY NOT NULL,
	"concert_id" integer NOT NULL,
	"url" text,
	"is_public" boolean DEFAULT true NOT NULL,
	"sort_order" smallint DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "concert_photos" ADD CONSTRAINT "concert_photos_concert_id_concerts_id_fk" FOREIGN KEY ("concert_id") REFERENCES "public"."concerts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "concerts" DROP COLUMN "image_url";