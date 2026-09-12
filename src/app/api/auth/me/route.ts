import { obterProfessorAutenticado } from "../../../_auth/exigirProfessor.ts";

export async function GET() {
  const professor = await obterProfessorAutenticado();
  if (!professor) {
    return Response.json({ erro: "não autenticado" }, { status: 401 });
  }

  return Response.json({ usuario: professor.usuario });
}
