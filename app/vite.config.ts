import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// V2 é servido na raiz de app/dist; o V1 continua intacto na raiz do repositório.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
