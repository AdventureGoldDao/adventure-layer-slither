import { defineConfig } from "tsup";
import packageJson from "./package.json";

// tsup doesn't bundle deps by default (https://tsup.egoist.dev/#excluding-packages),
// but we want to do that for dev-tools because it's used as a standalone package.
//
// However, we don't want mud deps to be bundled, because they have exported observables
// that are populated with data during mud usage, and that's the data we want to observe.
// Bundling these would mean dev-tools has a different instance of the observables and
// we'd see no data.

const peerDeps = Object.keys(packageJson.peerDependencies);
const bundledDeps = Object.keys(packageJson.dependencies).filter((dep) => !peerDeps.includes(dep));

export default defineConfig((opts) => ({
  entry: ["src/index.ts"],
  target: "esnext",
  format: ["esm"],
  sourcemap: true,
  minify: true,
  injectStyle: true,
  // bundle all non-peer deps
  noExternal: bundledDeps,
  // don't code split otherwise dep imports in bundle seem to break
  splitting: false,
  // don't generate DTS during watch mode because it's slow
  // we're likely using TS source in this mode anyway
  dts: !opts.watch,
  // don't clean during watch mode to avoid removing
  // previously-built DTS files, which other build tasks
  // depend on
  clean: !opts.watch,
}));
