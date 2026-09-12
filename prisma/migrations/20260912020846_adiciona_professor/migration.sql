-- CreateTable
CREATE TABLE "gestor_provas"."Professor" (
    "id" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Professor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Professor_usuario_key" ON "gestor_provas"."Professor"("usuario");
