import * as pty from 'node-pty';

let ptyProcess = pty.spawn('bash', [], {
  name: 'xterm-color',
  cols: 80,
  rows: 30,
  cwd: process.cwd() + "/workspace",
  env: process.env,
});

export {ptyProcess};