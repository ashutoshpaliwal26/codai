import fs from 'fs';
import p from 'path';

export const readFileContent = (path: string) => {
    try {
        const filePath = p.join(__dirname, `../../workspace/${path}`);
        const content = fs.readFileSync(filePath, 'utf-8');
        return content;
    } catch (err) {
        console.log((err as Error).message);
    }
}

export const writeFileContent = (filePath: string, content: string) => {
    try {
        const fPath = p.join(__dirname, `../../workspace/${filePath}`);
        fs.writeFileSync(fPath, content);
    } catch (err) {
        console.log("Error : ", (err as Error).message);
    }

}