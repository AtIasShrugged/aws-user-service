CREATE TABLE "user_address" (
	"id" bigserial PRIMARY KEY,
	"user_id" bigint NOT NULL,
	"address_line1" text,
	"address_line2" text,
	"city" varchar,
	"post_code" integer,
	"country" varchar,
	"created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE INDEX ON "user_address" ("city");
CREATE INDEX ON "user_address" ("post_code");
CREATE INDEX ON "user_address" ("country");

ALTER TABLE "user_address" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");