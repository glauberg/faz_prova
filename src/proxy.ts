import { type NextRequest, NextResponse } from "next/server";
import { verificarSessao } from "./domain/sessao.ts";

const ROTAS_PUBLICAS = ["/login"];
const NOME_COOKIE = "sessao";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (ROTAS_PUBLICAS.includes(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(NOME_COOKIE)?.value;
  const segredo = process.env.AUTH_SECRET;
  const sessaoValida = Boolean(token && segredo && verificarSessao(token, segredo));

  if (!sessaoValida) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
