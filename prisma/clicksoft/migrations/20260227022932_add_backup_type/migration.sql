-- CreateEnum
CREATE TYPE "backup_type" AS ENUM ('DB', 'FILE');

-- AlterTable
ALTER TABLE "linux_back" ADD COLUMN     "backup_type" "backup_type" NOT NULL DEFAULT 'DB';

-- CreateIndex
CREATE INDEX "idx_ykiho_backup_type" ON "linux_back"("ykiho", "backup_type");
