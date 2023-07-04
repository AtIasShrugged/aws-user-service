CREATE TABLE "user" (
	"id" bigserial PRIMARY KEY,
	"email" varchar UNIQUE NOT NULL,
	"first_name" varchar,
	"last_name" varchar,
	"phone_number" varchar NOT NULL,
	"password" varchar NOT NULL,
	"salt" varchar NOT NULL,
	"user_type" varchar NOT NULL,
	"profile_pic" text,
	"verification_code" integer,
	"expiry" timestamptz,
	"verified" boolean NOT NULL DEFAULT false,
	"created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE INDEX ON "user" ("phone_number");
