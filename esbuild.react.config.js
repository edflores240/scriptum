import esbuild from "esbuild";

esbuild.build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  outfile: "dist/scriptum-react.js",
  platform: "neutral",
  format: "esm",
  sourcemap: true,
  minify: true,
}).catch(() => process.exit(1));
