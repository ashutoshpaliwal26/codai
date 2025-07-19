import { DefaultEventsMap, Server, Socket } from "socket.io";
import { EventEmitter } from "stream";
import { ptyProcess } from "../service/ptyProcess";
import { readFileContent, writeFileContent } from "../utils/readContent";

class SocketServer {
    private io : Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
    
    constructor(io : Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
        this.io = io;
    }

    private event_handeler () {
        this.io.on("connection", (socket) => {
          socket.on('write:cmd', (data) => {
            ptyProcess.write(data);
          })
          socket.on('active:file', (data) => {
            if (!data) return;
            const content = readFileContent(data);
            this.io.emit("active:file:content", content);
          })
          socket.on("file:change", (d) => {
            // { activeFile: 'hello/index.js', data: '<html>' }
            const { activeFile, data } = d;
            if (activeFile === null) return;
            writeFileContent(activeFile, data);
          })
        })
    }

    public run () {
        ptyProcess.onData((data) => {
            this.io.emit("output:cmd", data)
        })
        this.event_handeler();
    }
}

export default SocketServer;