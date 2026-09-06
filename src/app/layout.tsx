import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Gestor de Provas",
  description: "Criação, correção e organização de avaliações.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
