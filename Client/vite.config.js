import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
 plugins: [react()],
 build: {
  outDir: "dist", // Ensure this is correctly set to your build directory
 },
 resolve: {
  alias: {
   "@": "/src", // Optional: If you want to use aliases for easier imports
  },
 },
});
