import { autenticarProfessor } from "../../../../persistence/professorRepository.ts";
import { criarSessao } from "../../../_auth/sessao.ts";

interface CorpoRequisicao {
  usuario?: string;
  senha?: string;
}

export async function POST(request: Request) {
  const corpo = (await request.json()) as CorpoRequisicao;

  if (!corpo.usuario || !corpo.senha) {
    return Response.json({ erro: "usuário e senha são obrigatórios" }, { status: 400 });
  }

  const professor = await autenticarProfessor(corpo.usuario, corpo.senha);
  if (!professor) {
    return Response.json({ erro: "usuário ou senha inválidos" }, { status: 401 });
  }

  await criarSessao(professor.id);

  return Response.json({ usuario: professor.usuario });
}
