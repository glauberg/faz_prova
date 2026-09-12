export interface ProvedorIa {
  nome: string;
  completar(prompt: string): Promise<string>;
}
