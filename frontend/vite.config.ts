import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "https://localhost:3000", // ← HTTPS に変更
        changeOrigin: true,
        secure: false, // 自己署名証明書を許可
      },
      "/auth": {
        target: "https://localhost:3000", // ← HTTPS に変更
        changeOrigin: true,
        secure: false, // 自己署名証明書を許可
      },
    },
  },
});
