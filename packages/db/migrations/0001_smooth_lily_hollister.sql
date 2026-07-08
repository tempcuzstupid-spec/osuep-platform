CREATE TABLE IF NOT EXISTS "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_id" uuid,
	"slug" varchar(80) NOT NULL,
	"name" varchar(200) NOT NULL,
	"description" text,
	"image_url" varchar(500),
	"position" integer DEFAULT 0 NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL,
	"seo_title" varchar(200),
	"seo_description" varchar(500),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_favorites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"url" varchar(1000) NOT NULL,
	"alt_text" varchar(300),
	"position" integer DEFAULT 0 NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"storage_ref" varchar(500),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_price_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"product_id" uuid,
	"rule_type" varchar(40) NOT NULL,
	"config" jsonb NOT NULL,
	"priority" integer DEFAULT 100 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"valid_from" timestamp with time zone,
	"valid_until" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"sku" varchar(80) NOT NULL,
	"size" varchar(40),
	"color" varchar(80),
	"color_hex" varchar(7),
	"list_price" numeric(12, 2),
	"stock_quantity" integer,
	"low_stock_threshold" integer DEFAULT 5 NOT NULL,
	"weight_grams" integer,
	"position" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_variants_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sku" varchar(80) NOT NULL,
	"name" varchar(300) NOT NULL,
	"short_description" varchar(500),
	"long_description" text,
	"category_id" uuid,
	"brand" varchar(120),
	"status" varchar(30) DEFAULT 'draft' NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"specs" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"list_price" numeric(12, 2) NOT NULL,
	"cost_basis" numeric(12, 2),
	"customizable" boolean DEFAULT false NOT NULL,
	"customization_config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"seo_title" varchar(200),
	"seo_description" varchar(500),
	"view_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_at" timestamp with time zone,
	CONSTRAINT "products_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supplier_feed_imports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"supplier_id" uuid NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone,
	"status" varchar(20) NOT NULL,
	"rows_processed" integer DEFAULT 0 NOT NULL,
	"rows_created" integer DEFAULT 0 NOT NULL,
	"rows_updated" integer DEFAULT 0 NOT NULL,
	"rows_skipped" integer DEFAULT 0 NOT NULL,
	"error_message" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supplier_product_mappings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"supplier_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"supplier_sku" varchar(120) NOT NULL,
	"supplier_name" varchar(300),
	"supplier_cost" numeric(12, 2),
	"last_seen_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "suppliers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(40) NOT NULL,
	"display_name" varchar(200),
	"feed_type" varchar(40) NOT NULL,
	"feed_config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"last_synced_at" timestamp with time zone,
	"last_sync_status" varchar(40),
	"last_sync_error" text,
	"product_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "suppliers_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "categories_parent_idx" ON "categories" ("parent_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "categories_slug_idx" ON "categories" ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "categories_public_idx" ON "categories" ("is_public","position");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "product_favorites_uniq" ON "product_favorites" ("user_id","product_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_favorites_org_idx" ON "product_favorites" ("org_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_images_product_idx" ON "product_images" ("product_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_images_primary_idx" ON "product_images" ("product_id","is_primary");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "price_rules_org_idx" ON "product_price_rules" ("org_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "price_rules_product_idx" ON "product_price_rules" ("product_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "price_rules_active_idx" ON "product_price_rules" ("is_active","priority");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_variants_product_idx" ON "product_variants" ("product_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "product_variants_sku_idx" ON "product_variants" ("sku");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "products_sku_idx" ON "products" ("sku");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "products_category_idx" ON "products" ("category_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "products_status_idx" ON "products" ("status","is_public");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "products_name_idx" ON "products" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "supplier_feed_imports_supplier_idx" ON "supplier_feed_imports" ("supplier_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "supplier_feed_imports_started_idx" ON "supplier_feed_imports" ("started_at");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "supplier_product_uniq" ON "supplier_product_mappings" ("supplier_id","product_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "supplier_sku_uniq" ON "supplier_product_mappings" ("supplier_id","supplier_sku");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "suppliers_code_idx" ON "suppliers" ("code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "suppliers_status_idx" ON "suppliers" ("status");