
import resolve from "rollup-plugin-node-resolve"
import commonjs from "rollup-plugin-commonjs"
import babel from "rollup-plugin-babel"
import uglify from "rollup-plugin-uglify"
import { minify } from "uglify-es"

import pkg from "./package.json"

const production = process.env.NODE_ENV === "production" ? [uglify({}, minify)] : []
const regular = [
  babel(),
].concat(production)

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
    ].concat(regular),
  },

  // CommonJS and ES6 Module
  {
    entry: "src/index.js",
    targets: [
      { dest: pkg.main, format: "cjs" },
      { dest: pkg.module, format: "es" },
    ],
    plugins: regular,
  },
]
