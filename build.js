require("esbuild").build({
    entryPoints: ["src/index.ts"],
    bundle: true,                // ensures node_modules get bundled
    format: "umd",
    globalName: "ScriptumEditor",
    outfile: "dist/scriptum.js",
    loader: {
      ".css": "text",
      ".png": "file",
      ".svg": "file"
    },
    external: [],                 // make sure ProseMirror is NOT external
    target: ["es2017"],
    minify: false
  }).catch(() => process.exit(1));