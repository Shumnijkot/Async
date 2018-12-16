import DirWatcher from "./src/dirwatcher/DirWatcher";
import Importer from "./src/importer/Importer";

const dirwatcher = new DirWatcher();
const importer = new Importer(dirwatcher);

dirwatcher.watch(1000, "./src/data");

dirwatcher.on('changed', (file)=>{
    console.log(`filePath is changed: ${file.path}`);
    importer.importSync(file)
})

