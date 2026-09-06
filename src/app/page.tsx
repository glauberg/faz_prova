import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <h1>Gestor de Provas</h1>
      <p>Criação, correção e organização de avaliações.</p>
      <p>
        <Link href="/provas/nova">Criar uma nova prova</Link>
      </p>
    </main>
  );
}
