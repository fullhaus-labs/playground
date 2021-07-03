-- CreateTable
CREATE TABLE "users" (
  "id" TEXT NOT NULL, 
  "no" SERIAL NOT NULL, 
  "first_name" TEXT NOT NULL, 
  "last_name" TEXT NOT NULL, 
  "email_address" TEXT NOT NULL, 
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, 
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, 
  PRIMARY KEY ("id")
);
-- CreateIndex
CREATE UNIQUE INDEX "users.email_address_unique" ON "users"("email_address");
