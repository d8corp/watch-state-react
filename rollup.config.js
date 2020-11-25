import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'

const def = {
  input: {
    index: 'src/index.ts',
  },
  external: [
    ...Object.keys(pkg.dependencies || {})
  ]
}

const exclude = [
  'src/**/*.test.ts',
  'src/**/*.test.tsx',
]

export default [{
  ...def,
  output: {
    dir: 'lib',
    entryFileNames: '[name]' + pkg.main.replace('index', ''),
    format: 'cjs'
  },
  plugins: [
    typescript({
      rollupCommonJSResolveHack: false,
      clean: true,
      tsconfigOverride: {
        compilerOptions: {
          module: 'esnext'
        },
        exclude
      }
    })
  ]
}, {
  ...def,
  output: {
    dir: 'lib',
    entryFileNames: '[name]' + pkg.module.replace('index', ''),
    format: 'es'
  },
  plugins: [
    typescript({
      rollupCommonJSResolveHack: false,
      clean: true,
      tsconfigOverride: {
        compilerOptions: {
          target: 'es6',
          module: 'esnext'
        },
        exclude
      }
    })
  ]
}]
