const { build } = require('esbuild');

build({
  entryPoints: ['src/bot.ts'],
  outdir: 'dist',
  bundle: true,
  platform: 'node',
  external: ['electron'],
}).then((result) => console.log('Build finalised with ', result));
