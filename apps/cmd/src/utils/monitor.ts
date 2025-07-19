import chokidar from 'chokidar'

export function monitorFiles (path : string) {
    const watcher = chokidar.watch(path, {
        persistent : true
    })

    watcher.on('add', path => console.log("file is added"));
    watcher.on('addDir', path => console.log("folder is added"))
}