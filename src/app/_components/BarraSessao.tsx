"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./BarraSessao.module.css";

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
    <header className={`${styles.navBar} no-imprimir`}>
      <Link href="/" className={styles.brand}>
        <div className={styles.brandIcon}>
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
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            <path d="m9 9.5 2 2 4-4" />
          </svg>
        </div>
        <span>Gestor de Provas</span>
      </Link>

      <nav className={styles.links}>
        <Link href="/" className={styles.link}>
          Dashboard
        </Link>
        <Link href="/provas" className={styles.link}>
          Provas
        </Link>
        <Link href="/questoes" className={styles.link}>
          Banco de Questões
        </Link>
      </nav>

      <div className={styles.userSection}>
        <div className={styles.userBadge}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span>{usuario}</span>
        </div>
        <button type="button" className={styles.logoutBtn} onClick={sair}>
          Sair
        </button>
      </div>
    </header>
  );
}
