import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/chip-tracker/", // ✅ Fix: Ensure correct base path for GitHub Pages
});