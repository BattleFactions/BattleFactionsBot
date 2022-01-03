const FtpDeploy = require('ftp-deploy');
const path = require('path');

require('dotenv').config();

const ftpDeploy = new FtpDeploy();

const config = {
  user: process.env.FTP_USERNAME,
  password: process.env.FTP_PASSWORD,
  host: process.env.FTP_HOST,
  port: process.env.FTP_PORT,
  localRoot: path.join(__dirname, '../../src'),
  remoteRoot: '/',
  include: ['*', '**/*', '.env'],
  exclude: ['**/*.map', 'node_modules/**', 'node_modules/**/.*', '.git/**'],
  deleteRemote: false,
  forcePasv: true,
  sftp: false,
};

ftpDeploy
  .deploy(config)
  .then((res) => console.log('Success:', res))
  .catch((err) => console.log('Error:', err));
