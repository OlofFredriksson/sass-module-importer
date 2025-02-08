import { build } from "esbuild";

await build({
    entryPoints: ["./src/importer.js"],
    outdir: "./dist",
    minify: false,
    bundle: true,
    external: ["resolve.exports", "resolve-package-path"],
    platform: "node",
    format: "esm",
    target: "node20",
});
