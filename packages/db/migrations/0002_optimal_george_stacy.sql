DO $$ BEGIN
 CREATE TYPE "public"."approval_status" AS ENUM('pending', 'approved', 'rejected', 'skipped');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."artwork_status" AS ENUM('draft', 'pending_review', 'approved', 'rejected', 'archived');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."cart_status" AS ENUM('open', 'submitted', 'abandoned', 'converted');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."document_type" AS ENUM('invoice', 'packing_slip', 'proof', 'contract', 'quote', 'tax_form', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."invoice_status" AS ENUM('draft', 'issued', 'paid', 'overdue', 'void');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."notification_kind" AS ENUM('order_placed', 'order_approved', 'order_rejected', 'order_shipped', 'order_delivered', 'approval_required', 'invoice_issued', 'invoice_overdue', 'message_received', 'system');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."order_status" AS ENUM('draft', 'pending_approval', 'approved', 'in_production', 'ready_to_ship', 'shipped', 'delivered', 'cancelled', 'on_hold');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "approvals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"approver_user_id" uuid NOT NULL,
	"status" "approval_status" DEFAULT 'pending' NOT NULL,
	"decided_at" timestamp with time zone,
	"note" text,
	"level" integer DEFAULT 1 NOT NULL,
	"required_because" varchar(200),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "artwork_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"artwork_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"file_url" varchar(1000) NOT NULL,
	"storage_ref" varchar(500),
	"mime_type" varchar(100) NOT NULL,
	"file_size" integer,
	"color_profile" varchar(80),
	"notes" text,
	"uploaded_by_user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "artworks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"name" varchar(200) NOT NULL,
	"description" text,
	"status" "artwork_status" DEFAULT 'draft' NOT NULL,
	"current_version" integer DEFAULT 1 NOT NULL,
	"notes" text,
	"uploaded_by_user_id" uuid NOT NULL,
	"approved_at" timestamp with time zone,
	"approved_by_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cart_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cart_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"variant_id" uuid,
	"sku" varchar(80) NOT NULL,
	"product_name" varchar(300) NOT NULL,
	"size" varchar(40),
	"color" varchar(80),
	"quantity" integer DEFAULT 1 NOT NULL,
	"unit_price" numeric(12, 2) NOT NULL,
	"customization" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"line_note" text,
	"assigned_to_user_id" uuid,
	"assigned_to_name" varchar(200),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "carts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"status" "cart_status" DEFAULT 'open' NOT NULL,
	"name" varchar(200),
	"notes" text,
	"requires_approval" boolean DEFAULT false NOT NULL,
	"subtotal" numeric(12, 2) DEFAULT '0' NOT NULL,
	"total" numeric(12, 2) DEFAULT '0' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"submitted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"type" "document_type" NOT NULL,
	"title" varchar(300) NOT NULL,
	"file_url" varchar(1000),
	"storage_ref" varchar(500),
	"mime_type" varchar(100),
	"file_size" integer,
	"related_to_type" varchar(40),
	"related_to_id" uuid,
	"uploaded_by_user_id" uuid,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invoice_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_id" uuid NOT NULL,
	"description" text NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" numeric(12, 2) NOT NULL,
	"total" numeric(12, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_number" varchar(40) NOT NULL,
	"order_id" uuid,
	"org_id" uuid NOT NULL,
	"status" "invoice_status" DEFAULT 'draft' NOT NULL,
	"subtotal" numeric(12, 2) NOT NULL,
	"tax" numeric(12, 2) DEFAULT '0' NOT NULL,
	"total" numeric(12, 2) NOT NULL,
	"amount_paid" numeric(12, 2) DEFAULT '0' NOT NULL,
	"issued_at" timestamp with time zone,
	"due_at" timestamp with time zone,
	"paid_at" timestamp with time zone,
	"pdf_url" varchar(1000),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "invoices_invoice_number_unique" UNIQUE("invoice_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"thread_id" uuid NOT NULL,
	"from_user_id" uuid,
	"is_from_osuep" boolean DEFAULT false NOT NULL,
	"body" text NOT NULL,
	"related_to_type" varchar(40),
	"related_to_id" uuid,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"kind" "notification_kind" NOT NULL,
	"title" varchar(200) NOT NULL,
	"body" text,
	"href" varchar(1000),
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"status" varchar(40) NOT NULL,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	"actor_user_id" uuid,
	"actor_role" varchar(40),
	"note" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"product_id" uuid,
	"variant_id" uuid,
	"sku" varchar(80) NOT NULL,
	"product_name" varchar(300) NOT NULL,
	"product_image" varchar(1000),
	"size" varchar(40),
	"color" varchar(80),
	"quantity" integer NOT NULL,
	"unit_price" numeric(12, 2) NOT NULL,
	"setup_fee" numeric(12, 2) DEFAULT '0' NOT NULL,
	"line_total" numeric(12, 2) NOT NULL,
	"customization" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"production_status" varchar(40) DEFAULT 'pending' NOT NULL,
	"assigned_decorator_id" varchar(80),
	"assigned_to_user_id" uuid,
	"assigned_to_name" varchar(200),
	"line_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"order_number" varchar(40) NOT NULL,
	"placed_by_user_id" uuid NOT NULL,
	"contact_user_id" uuid,
	"status" "order_status" DEFAULT 'draft' NOT NULL,
	"buyer_po_number" varchar(80),
	"subtotal" numeric(12, 2) DEFAULT '0' NOT NULL,
	"tax" numeric(12, 2) DEFAULT '0' NOT NULL,
	"shipping" numeric(12, 2) DEFAULT '0' NOT NULL,
	"total" numeric(12, 2) DEFAULT '0' NOT NULL,
	"ship_to_location_id" uuid,
	"ship_to_name" varchar(200),
	"ship_to_address" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"bill_to_location_id" uuid,
	"bill_to_address" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"customer_notes" text,
	"internal_notes" text,
	"placed_at" timestamp with time zone,
	"expected_at" timestamp with time zone,
	"shipped_at" timestamp with time zone,
	"delivered_at" timestamp with time zone,
	"cancelled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shipments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"carrier" varchar(40),
	"tracking_number" varchar(200),
	"service_level" varchar(40),
	"shipped_at" timestamp with time zone,
	"estimated_at" timestamp with time zone,
	"delivered_at" timestamp with time zone,
	"status" varchar(40) DEFAULT 'pending' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "approvals_order_idx" ON "approvals" ("order_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "approvals_approver_idx" ON "approvals" ("approver_user_id","status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "artwork_versions_artwork_idx" ON "artwork_versions" ("artwork_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "artwork_versions_uniq" ON "artwork_versions" ("artwork_id","version");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "artworks_org_idx" ON "artworks" ("org_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "artworks_status_idx" ON "artworks" ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cart_items_cart_idx" ON "cart_items" ("cart_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cart_items_product_idx" ON "cart_items" ("product_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "carts_org_idx" ON "carts" ("org_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "carts_user_idx" ON "carts" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "carts_status_idx" ON "carts" ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "documents_org_idx" ON "documents" ("org_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "documents_type_idx" ON "documents" ("type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "documents_related_idx" ON "documents" ("related_to_type","related_to_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "invoice_lines_invoice_idx" ON "invoice_lines" ("invoice_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "invoices_org_idx" ON "invoices" ("org_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "invoices_order_idx" ON "invoices" ("order_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "invoices_status_idx" ON "invoices" ("status");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "invoices_number_uniq" ON "invoices" ("invoice_number");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "messages_org_idx" ON "messages" ("org_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "messages_thread_idx" ON "messages" ("thread_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notifications_user_idx" ON "notifications" ("user_id","read_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notifications_org_idx" ON "notifications" ("org_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_events_order_idx" ON "order_events" ("order_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_events_occurred_at_idx" ON "order_events" ("occurred_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_items_order_idx" ON "order_items" ("order_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_items_product_idx" ON "order_items" ("product_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_items_prod_status_idx" ON "order_items" ("production_status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "orders_org_idx" ON "orders" ("org_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "orders_status_idx" ON "orders" ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "orders_placed_by_idx" ON "orders" ("placed_by_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "orders_number_uniq" ON "orders" ("order_number");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "orders_placed_at_idx" ON "orders" ("placed_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "shipments_order_idx" ON "shipments" ("order_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "shipments_tracking_idx" ON "shipments" ("tracking_number");