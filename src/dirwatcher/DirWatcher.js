import EventEmiter from 'events';
import fs from 'fs';

class DirWatcher extends EventEmiter {
    constructor(){
        super();
        this.__fileList = {
            // path: { lastChanged: Date }
        }
    }

    readDir(folderPath){
        fs.readdir(folderPath, (err, files) => {
            if(err) {
                throw new Error(err.message);
            }
            files.forEach(file => {
                this.checkFilePath(`${folderPath}/${file}`);
            });
        });
    }   

    watch(delay, path){
        if(!path) {
            throw new Error("Argument 'path' should not be empty");
        }
        try {
            this.__watchInterval = setInterval(()=>this.readDir(path), delay);
        }
        catch (e){
            throw new Error(e.message);
        }
    }

    stopWatching(){
        clearInterval(this.__watchInterval);
        this.__fileList = {};
    }

    checkFilePath(path){
        if(!path) {
            return null;
        }
        const self = this;

        const __fileList = this.__fileList;
        fs.stat(path, (err, stat)=>{
            if(err) throw new Error(err.message)
            const fileRecord = __fileList[path];

            if(!fileRecord 
                || !fileRecord.lastChanged 
                || new Date(fileRecord.lastChanged) < new Date(stat.mtime)){
                self.udateFilePath(path, stat);
                self.emit('changed', {path});
            }
        })
    }

    udateFilePath(path, stat){
        const newRecord = {
            ...this.__fileList[path],
            lastChanged: stat.mtime

        }
        this.__fileList[path] = newRecord;
    }
}

export default DirWatcher;