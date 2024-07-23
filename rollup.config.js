import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import css from 'rollup-plugin-import-css';
import resolve from '@rollup/plugin-node-resolve';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

const plugins = [
  commonjs(),
  resolve(),
  peerDepsExternal(),
  css(),
  typescript({
    tsconfig: './tsconfig.json',
    declaration: true,
    declarationDir: 'dist',
    include: ['node_modules/@rolster/types/index.d.ts']
  })
];

const rollupTs = (file) => {
  return {
    input: [`dist/esm/${file}.js`],
    output: [
      {
        file: `dist/cjs/${file}.js`,
        format: 'cjs',
        sourcemap: true,
        inlineDynamicImports: true
      },
      {
        file: `dist/es/${file}.js`,
        format: 'es',
        sourcemap: true,
        inlineDynamicImports: true
      }
    ],
    external: [
      '@rolster/helpers-advanced',
      '@rolster/helpers-date',
      '@rolster/helpers-forms',
      '@rolster/helpers-string',
      '@rolster/i18n',
      '@rolster/validators',
      'rxjs',
      'uuid'
    ],
    plugins
  };
};

export default [rollupTs('index')];
