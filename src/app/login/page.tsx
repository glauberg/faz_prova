"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);

    try {
      const resposta = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, senha }),
      });
      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.erro ?? "não foi possível entrar");
        return;
      }

      router.push("/");
      router.refresh();
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main>
      <h1>Entrar</h1>
      <form onSubmit={enviar}>
        <label>
          Usuário
          <input
            type="text"
            value={usuario}
            onChange={(evento) => setUsuario(evento.target.value)}
            required
          />
        </label>

        <label>
          Senha
          <input
            type="password"
            value={senha}
            onChange={(evento) => setSenha(evento.target.value)}
            required
          />
        </label>

        {erro && <p className="erro">{erro}</p>}

        <button type="submit" disabled={enviando}>
          {enviando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
