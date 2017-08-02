
import resolve from "rollup-plugin-node-resolve"
import commonjs from "rollup-plugin-commonjs"
import babel from "rollup-plugin-babel"
import pkg from "./package.json"

export default [
  // UMD Build (Browser)
  {
    entry: "src/index.js",
    dest: pkg.browser,
    format: "umd",
    moduleName: "GPRoutine",
    plugins: [
      resolve(),
      commonjs(),
      babel(),
    ],
  },

  // CommonJS and ES6 Module
  {
    entry: "src/index.js",
    targets: [
      { dest: pkg.main, format: "cjs" },
      { dest: pkg.module, format: "es" },
    ],
    plugins: [
      babel(),
    ],
  },
]
