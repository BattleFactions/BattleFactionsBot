const { build } = require('esbuild');

build({
  entryPoints: ['src/bot.ts'],
  outdir: 'dist',
  bundle: true,
  platform: 'node',
  external: [
    'electron',
    '@aws-sdk/client-dynamodb',
    '@aws-sdk/util-dynamodb',
    '@discordjs/builders',
    '@discordjs/rest',
    '@imtbl/imx-sdk',
    'axios',
    'dayjs',
    'discord-api-types',
    'discord.js',
    'ethers',
    'http-status-codes',
    'merge',
    'web3',
  ],
}).then((result) => console.log('Build finalised with ', result));
