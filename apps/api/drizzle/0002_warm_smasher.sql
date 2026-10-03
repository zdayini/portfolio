ALTER TABLE "concerts" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "concerts" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "concerts" ADD CONSTRAINT "concerts_artist_date_unique" UNIQUE("artist","date");