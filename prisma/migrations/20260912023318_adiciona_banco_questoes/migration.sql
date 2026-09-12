-- AlterTable
ALTER TABLE "gestor_provas"."Questao" ADD COLUMN     "origemBancoId" TEXT;

-- CreateTable
CREATE TABLE "gestor_provas"."QuestaoBanco" (
    "id" TEXT NOT NULL,
    "tema" TEXT NOT NULL,
    "tipo" "gestor_provas"."TipoQuestao" NOT NULL,
    "enunciado" TEXT NOT NULL,
    "alternativas" TEXT[],
    "gabaritoTexto" TEXT,
    "gabaritoBooleano" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestaoBanco_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "gestor_provas"."Questao" ADD CONSTRAINT "Questao_origemBancoId_fkey" FOREIGN KEY ("origemBancoId") REFERENCES "gestor_provas"."QuestaoBanco"("id") ON DELETE SET NULL ON UPDATE CASCADE;
