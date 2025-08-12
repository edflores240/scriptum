import esbuild from "esbuild";

esbuild.build({
  entryPoints: ["src/index.umd.ts"],
  bundle: true,
  outfile: "dist/scriptum.js",
  format: "iife",
  globalName: "ScriptumEditor",
  target: ["es2017"],
  sourcemap: true,
  minify: false,
  loader: {
    ".css": "css",
  },
}).catch(() => process.exit(1));
