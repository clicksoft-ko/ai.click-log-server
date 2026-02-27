-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "linux_back" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ykiho" VARCHAR(8) NOT NULL,
    "key" VARCHAR(20) NOT NULL,
    "backup_path" TEXT NOT NULL,
    "started_at" TIMESTAMPTZ NOT NULL,
    "ended_at" TIMESTAMPTZ,

    CONSTRAINT "linux_back_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "linux_back_db" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "back_id" UUID NOT NULL,
    "db_name" VARCHAR(30) NOT NULL,
    "elapsed_ms" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "linux_back_db_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "linux_back_tbl" (
    "id" BIGSERIAL NOT NULL,
    "back_db_id" UUID NOT NULL,
    "tbl_name" VARCHAR(30) NOT NULL,
    "elapsed_ms" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "error_message" TEXT,

    CONSTRAINT "linux_back_tbl_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_ykiho" ON "linux_back"("ykiho");

