CREATE TABLE "concerts" (
	"id" serial PRIMARY KEY NOT NULL,
	"artist" text NOT NULL,
	"venue" text NOT NULL,
	"city" text NOT NULL,
	"country" text NOT NULL,
	"date" date NOT NULL,
	"rating" smallint,
	"notes" text,
	"image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
