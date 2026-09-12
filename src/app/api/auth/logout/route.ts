import { encerrarSessao } from "../../../_auth/sessao.ts";

export async function POST() {
  await encerrarSessao();
  return Response.json({ ok: true });
}
