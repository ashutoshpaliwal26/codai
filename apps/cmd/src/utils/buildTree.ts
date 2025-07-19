import fs from 'fs/promises';
import path from 'path';

export interface FileNode {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  path: string;
  isOpen?: boolean;
}


export function sortTree(treeNode: FileNode[]) {
  return treeNode.map((node: FileNode) : FileNode => {
    if(node.type === 'folder' && node.children){
      return {
        ...node,
        children : sortTree(node.children)
      };
    }
    return node;
  }).sort((a, b) => {
    if(a.type === b.type) {
      return a.name.localeCompare(b.name);
    }
    return a.type === "folder" ? -1 : 1;
  })
}

export const buildTree = async (dirPath: string, basePath: string = dirPath): Promise<FileNode[]> => {
  const entries = await fs.readdir(dirPath);
  const result: FileNode[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry);
    const relativePath = path.relative(basePath, fullPath);
    const stat = await fs.lstat(fullPath);

    if (stat.isDirectory()) {
      const children = await buildTree(fullPath, basePath);
      result.push({
        name: entry,
        type: "folder",
        children,
        path: relativePath,
        isOpen: false
      });
    } else {
      result.push({
        name: entry,
        type: "file",
        path: relativePath
      });
    }
  }

  return sortTree(result);
};