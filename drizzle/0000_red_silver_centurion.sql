CREATE TABLE IF NOT EXISTS "measures" (
	"measure_uuid" text PRIMARY KEY NOT NULL,
	"measure_datetime" timestamp NOT NULL,
	"measure_type" text NOT NULL,
	"has_confirmed" boolean DEFAULT false NOT NULL,
	"image_url" text NOT NULL,
	"customer_code" text NOT NULL
);
