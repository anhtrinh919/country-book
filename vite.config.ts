import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/country-book/", // GitHub Pages project sub-path
  plugins: [react()],
  server: { port: 5173 },
});
