import {
  buscarProfessorPorId,
  type ProfessorAutenticado,
} from "../../persistence/professorRepository.ts";
import { obterSessao } from "./sessao.ts";

export async function obterProfessorAutenticado(): Promise<ProfessorAutenticado | null> {
  const sessao = await obterSessao();
  if (!sessao) {
    return null;
  }
  return buscarProfessorPorId(sessao.professorId);
}
