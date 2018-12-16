import { promisify } from "util";
import fs from "fs";
import csvjson from "csvjson";

export default class Importer {
    constructor(emitter){
        if(!emitter){
            throw new Error("Emitter can not be empty")
        }
        this.__emitter = emitter;
        this.__emitter.on('changed', file => this.import(file));
        return this;
    }

    import(file){
        const path = file.path;
        if(!path) {
            return null;
        }
        const readFilePromise = promisify(fs.readFile)
        return readFilePromise(path, 'utf8').then(
            (data)=>this.fileToObject(data)
            );
    }

    importSync(file){
        const path = file.path;
        if(!path) {
            return null;
        }
        const data = fs.readFileSync(path, 'utf8');
        return this.fileToObject(data);
    }

    fileToObject(fileContent, options){
        const readOptions = options || {
            delimiter : ',',
            quote     : '"' 
        }
        const data = csvjson.toObject(fileContent, readOptions);
        console.log(data);
        return data;
    }
}