-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "gestor_provas";

-- CreateEnum
CREATE TYPE "gestor_provas"."TipoQuestao" AS ENUM ('discursiva', 'multipla_escolha', 'dicotomica', 'resposta_unica');

-- CreateEnum
CREATE TYPE "gestor_provas"."StatusQuestaoResultado" AS ENUM ('acertou', 'errou', 'pendente');

-- CreateTable
CREATE TABLE "gestor_provas"."Prova" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Prova_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gestor_provas"."Questao" (
    "id" TEXT NOT NULL,
    "provaId" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "tipo" "gestor_provas"."TipoQuestao" NOT NULL,
    "enunciado" TEXT NOT NULL,
    "alternativas" TEXT[],
    "gabaritoTexto" TEXT,
    "gabaritoBooleano" BOOLEAN,

    CONSTRAINT "Questao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gestor_provas"."ResultadoProva" (
    "id" TEXT NOT NULL,
    "provaId" TEXT NOT NULL,
    "alunoId" TEXT NOT NULL,
    "acertosObjetivas" INTEGER NOT NULL,
    "totalObjetivas" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResultadoProva_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gestor_provas"."ResultadoQuestao" (
    "id" TEXT NOT NULL,
    "resultadoProvaId" TEXT NOT NULL,
    "questaoId" TEXT NOT NULL,
    "status" "gestor_provas"."StatusQuestaoResultado" NOT NULL,

    CONSTRAINT "ResultadoQuestao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Questao_provaId_ordem_key" ON "gestor_provas"."Questao"("provaId", "ordem");

-- AddForeignKey
ALTER TABLE "gestor_provas"."Questao" ADD CONSTRAINT "Questao_provaId_fkey" FOREIGN KEY ("provaId") REFERENCES "gestor_provas"."Prova"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gestor_provas"."ResultadoProva" ADD CONSTRAINT "ResultadoProva_provaId_fkey" FOREIGN KEY ("provaId") REFERENCES "gestor_provas"."Prova"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gestor_provas"."ResultadoQuestao" ADD CONSTRAINT "ResultadoQuestao_resultadoProvaId_fkey" FOREIGN KEY ("resultadoProvaId") REFERENCES "gestor_provas"."ResultadoProva"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gestor_provas"."ResultadoQuestao" ADD CONSTRAINT "ResultadoQuestao_questaoId_fkey" FOREIGN KEY ("questaoId") REFERENCES "gestor_provas"."Questao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

