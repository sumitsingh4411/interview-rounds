CREATE TYPE "public"."outcome" AS ENUM('offer', 'rejected', 'no_offer', 'withdrew', 'unknown');--> statement-breakpoint
ALTER TYPE "public"."source_type" ADD VALUE 'curated';--> statement-breakpoint
CREATE TABLE "interviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_id" integer NOT NULL,
	"role" "role" NOT NULL,
	"level" "level" NOT NULL,
	"outcome" "outcome" DEFAULT 'unknown' NOT NULL,
	"title" text,
	"summary" text,
	"year" integer,
	"source_type" "source_type" NOT NULL,
	"source_url" text,
	"source_author" text,
	"status" "question_status" DEFAULT 'published' NOT NULL,
	"content_hash" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "interviews_content_hash_unique" UNIQUE("content_hash")
);
--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "interview_id" integer;--> statement-breakpoint
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "interviews_company_idx" ON "interviews" USING btree ("company_id","role","level");--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_interview_id_interviews_id_fk" FOREIGN KEY ("interview_id") REFERENCES "public"."interviews"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "questions_interview_idx" ON "questions" USING btree ("interview_id");