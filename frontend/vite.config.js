import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT: change base to match your GitHub repo name, e.g. "/avash-portfolio/"
// If you're using a custom domain or a "username.github.io" root repo, set base to "/"
export default defineConfig({
  plugins: [react()],
  base: "/avash-portfolio/",
});
