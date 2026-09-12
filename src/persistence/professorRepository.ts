import { criarHashSenha, verificarSenha } from "../domain/senha.ts";
import { prisma } from "./prisma.ts";

export interface ProfessorAutenticado {
  id: string;
  usuario: string;
}

export async function criarOuAtualizarProfessor(usuario: string, senha: string): Promise<void> {
  const senhaHash = criarHashSenha(senha);
  await prisma.professor.upsert({
    where: { usuario },
    create: { usuario, senhaHash },
    update: { senhaHash },
  });
}

export async function autenticarProfessor(
  usuario: string,
  senha: string,
): Promise<ProfessorAutenticado | null> {
  const professor = await prisma.professor.findUnique({ where: { usuario } });
  if (!professor || !verificarSenha(senha, professor.senhaHash)) {
    return null;
  }

  return { id: professor.id, usuario: professor.usuario };
}

export async function buscarProfessorPorId(id: string): Promise<ProfessorAutenticado | null> {
  const professor = await prisma.professor.findUnique({ where: { id } });
  if (!professor) {
    return null;
  }

  return { id: professor.id, usuario: professor.usuario };
}
