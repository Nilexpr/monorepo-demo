import { defineConfig, mergeConfig } from "vite";
import path from "path";
import { MonorepoViteConfig } from "@repo/vite-config";

export default defineConfig(
  mergeConfig(
    {
      build: {
        lib: {
          entry: [path.resolve(__dirname, "src/index.ts")],
          name: "tree",
          formats: ["es"],
        },
        minify: false,
        sourcemap: true,
      },
    },
    MonorepoViteConfig()
  )
);
