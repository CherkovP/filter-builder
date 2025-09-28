import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entryPoints: ["src/index.ts", "src/styles/tailwind.css"],
  format: ["cjs", "esm"],
  dts: true,
  external: ["react"],
  ...options,
}));
