// esbuild.config.mjs
import esbuild from "esbuild";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

/**
 * Some versions of `esbuild-plugin-tsconfig-paths` export different shapes.
 * We normalize it to a single callable plugin factory.
 */
function loadTsconfigPathsPlugin() {
  const mod = require("esbuild-plugin-tsconfig-paths");

  const pluginFactory =
    mod.tsconfigPathsPlugin ??
    mod.default?.tsconfigPathsPlugin ??
    mod.default ??
    mod.tsconfigPaths;

  if (typeof pluginFactory !== "function") {
    const exportsList = Object.keys(mod).join(", ") || "(none)";
    throw new Error(
      `[build] Could not load tsconfig paths plugin. Expected a function export.\n` +
        `[build] Module exports: ${exportsList}`
    );
  }

  return pluginFactory;
}

async function build() {
  const tsconfigPathsPlugin = loadTsconfigPathsPlugin();

  await esbuild.build({
    entryPoints: ["src/extension.ts"],
    bundle: true,

    platform: "node",
    format: "cjs",
    target: "node18",

    outfile: "dist/extension.js",
    external: ["vscode"],

    sourcemap: true,
    plugins: [tsconfigPathsPlugin()],
  });
}

build().catch((err) => {
  console.error("[build] Build failed:", err);
  process.exit(1);
});