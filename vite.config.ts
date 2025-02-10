import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import legacy from "@vitejs/plugin-legacy"; // Import it

import { viteSingleFile } from "vite-plugin-singlefile";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    tailwindcss(),
    legacy({
      targets: ["ie >= 10"], //Target IE 11, adjust as needed
    }),
  ],
});
