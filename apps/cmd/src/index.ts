import express, { Request, Response } from 'express'
import { createServer } from 'http'
import cors from 'cors'
import { Server } from 'socket.io'
import path from 'path';
import { buildTree } from './utils/buildTree'
import chokidar from 'chokidar'
import SocketServer from './socket/sockerServer'
import { exec } from 'child_process'

exec("mkdir workspace", (error, stdout, stderr) => {
  if(error) {
    console.log(`Error : ${error.message}`);
    return;
  }
  if(stderr){
    console.log(`STDERR : ${stderr}`);
    return;
  }
  console.log(`stdout : ${stdout}`);
})

const app = express();
const server = createServer(app);
const PORT = process.env.CMD_PORT || 8001;
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const socketServer = new SocketServer(io);

socketServer.run();

// Middleware
app.use(cors());
app.use(express.json());

console.log(path.join(__dirname, "./workspace"))


// Watcher Setup
const watcher = chokidar.watch('../workspace', {
  persistent: true,
  ignoreInitial: true,
  depth: Infinity,
});

watcher
  .on('add', path => logTreeChange(path, 'file added'))
  .on('addDir', path => logTreeChange(path, 'folder added'))
  .on('unlink', path => logTreeChange(path, 'file removed'))
  .on('unlinkDir', path => logTreeChange(path, 'folder removed'));

async function getTreeData() {
  const dirPath = path.resolve(__dirname, "./workspace");
  const tree = await buildTree(dirPath);
  return tree;
}

async function logTreeChange(p: string, event: string) {
  io.emit("dir:change", { p, event });
}

app.get("/get-files", async (req: Request, res: Response) => {
  return res.json({ success: false, tree: await getTreeData() });
})

server.listen(PORT, () => console.log(`|------- SERVER RUNNING ON PORT : ${PORT} --------------|`))


