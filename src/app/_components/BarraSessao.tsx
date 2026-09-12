"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function BarraSessao() {
  const router = useRouter();
  const pathname = usePathname();
  const [usuario, setUsuario] = useState<string | null>(null);

  useEffect(() => {
    if (pathname === "/login") {
      setUsuario(null);
      return;
    }

    fetch("/api/auth/me")
      .then(async (resposta) => {
        if (!resposta.ok) {
          setUsuario(null);
          return;
        }
        const dados = await resposta.json();
        setUsuario(dados.usuario);
      })
      .catch(() => setUsuario(null));
  }, [pathname]);

  async function sair() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  if (pathname === "/login" || !usuario) {
    return null;
  }

  return (
    <p>
      {usuario} ·{" "}
      <button type="button" onClick={sair}>
        Sair
      </button>
    </p>
  );
}
