import { defineConfig } from "prisma/config";

// `prisma generate` só lê o schema e não precisa de conexão real —
// por isso lemos process.env diretamente (sem lançar erro se ausente,
// como faria o helper `env()`), permitindo rodar `generate` em CI sem
// as credenciais do banco.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DIRECT_URL ?? "",
  },
});
