import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import legacy from "@vitejs/plugin-legacy";

export default defineConfig({
  plugins: [
    react(),
    legacy({
      // этого хватает, чтобы вырезать optional chaining и пр.
      targets: ["defaults", "not IE 11"],
      modernPolyfills: true
    })
  ],
  base: "./", // для Tilda/копипаста; для GH Pages в подкаталоге укажи base: "/REPO/"
  build: {
    target: "es2018" // можно es2019; главное — ниже, чем по умолчанию
  },
  optimizeDeps: { include: ["react", "react-dom", "@plasmicapp/loader-react"] }
});
