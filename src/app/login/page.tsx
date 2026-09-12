"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
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
        setErro(dados.erro ?? "Não foi possível entrar");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setErro("Erro de conexão ao tentar fazer login.");
    } finally {
      setEnviando(false);
    }
  }

  function preencherDemo() {
    setUsuario("profteste");
    setSenha("prof123");
    setErro(null);
  }

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <header className={styles.header}>
          <div className={styles.logoIcon}>
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              <path d="m9 9.5 2 2 4-4" />
            </svg>
          </div>
          <h1 className={styles.title}>Gestor de Provas</h1>
          <p className={styles.subtitle}>
            Acesse seu painel para criar, organizar e corrigir avaliações
          </p>
        </header>

        <form className={styles.form} onSubmit={enviar}>
          <div className={styles.group}>
            <label className={styles.label} htmlFor="usuario">
              Usuário
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="usuario"
                type="text"
                className={styles.input}
                placeholder="Informe seu usuário"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
                disabled={enviando}
                autoComplete="username"
              />
            </div>
          </div>

          <div className={styles.group}>
            <label className={styles.label} htmlFor="senha">
              Senha
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="senha"
                type={mostrarSenha ? "text" : "password"}
                className={`${styles.input} ${styles.inputHasToggle}`}
                placeholder="Informe sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                disabled={enviando}
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setMostrarSenha(!mostrarSenha)}
                title={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              >
                {mostrarSenha ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {erro && (
            <div className={styles.errorBanner} role="alert">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{erro}</span>
            </div>
          )}

          <button type="submit" className={styles.submitBtn} disabled={enviando}>
            {enviando ? (
              <>
                <span className={styles.spinner} aria-hidden="true" />
                <span>Entrando...</span>
              </>
            ) : (
              <span>Entrar</span>
            )}
          </button>
        </form>

        <div className={styles.demoBox}>
          <p className={styles.demoTitle}>Ambiente de Demonstração</p>
          <button type="button" className={styles.demoBtn} onClick={preencherDemo}>
            <span>Preencher credenciais de teste</span>
            <strong>profteste</strong>
          </button>
        </div>
      </div>

      <footer className={styles.footerText}>
        Gestor de Provas &copy; {new Date().getFullYear()} &mdash; Plataforma de Avaliações
      </footer>
    </main>
  );
}
