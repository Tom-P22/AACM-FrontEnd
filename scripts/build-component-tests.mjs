import { build } from "esbuild";
import { transformSync } from "@babel/core";
import { readFile } from "node:fs/promises";
import path from "node:path";

await build({
  entryPoints: ["tests/components/components.spec.jsx"],
  outfile: ".karma-build/components.js",
  bundle: true,
  format: "iife",
  jsx: "automatic",
  sourcemap: "inline",
  define: { "process.env.NODE_ENV": '"test"' },
  plugins: [{
    name: "component-test-environment",
    setup(builder) {
      // Dobles de contexto: aíslan componentes de sesiones y almacenamiento real.
      builder.onResolve({ filter: /(?:Auth|Content|Cart|Reservation)Context(?:\.jsx)?$/ }, (args) => {
        if (!args.importer.includes(`${path.sep}src${path.sep}`)) return;
        return { path: path.resolve("tests/components/context-mocks.jsx") };
      });
      builder.onLoad({ filter: /[\\/]src[\\/].*\.(jsx|js)$/ }, async (args) => {
        const source = await readFile(args.path, "utf8");
        const result = transformSync(source, {
          filename: args.path,
          babelrc: false,
          configFile: false,
          parserOpts: { plugins: ["jsx"] },
          plugins: [["babel-plugin-istanbul", { include: ["src/**/*"], exclude: [] }]],
          sourceMaps: "inline",
        });
        return { contents: result.code, loader: args.path.endsWith(".jsx") ? "jsx" : "js" };
      });
    },
  }],
});
