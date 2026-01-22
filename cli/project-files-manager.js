const fs = require('fs-extra');
const path = require('path');
const { consola } = require('consola');

class ProjectFilesManager {
  #projectRoot;

  /**
   * @param {string} projectRoot - Absolute path of the project root
   */
  constructor(projectRoot) {
    this.#projectRoot = projectRoot;
  }

  /**
   * Factory method
   * @param {string} projectRoot
   */
  static withProjectRoot(projectRoot) {
    return new this(projectRoot);
  }

  /**
   * Resolve absolute path from project root
   * @param {string} relativeFilePath
   */
  getAbsoluteFilePath(relativeFilePath) {
    return path.join(this.#projectRoot, relativeFilePath);
  }

  /**
   * Remove files or folders safely
   * @param {Array<string>} files
   */
  removeFiles(files) {
    files.forEach((relativePath) => {
      const absolutePath = this.getAbsoluteFilePath(relativePath);

      if (!fs.existsSync(absolutePath)) {
        consola.warn(`Skipped missing file/folder: ${relativePath}`);
        return;
      }

      fs.removeSync(absolutePath);
    });
  }

  /**
   * Rename files safely
   * @param {Array<{ oldFileName: string; newFileName: string }>} files
   */
  renameFiles(files) {
    files.forEach(({ oldFileName, newFileName }) => {
      const oldPath = this.getAbsoluteFilePath(oldFileName);
      const newPath = this.getAbsoluteFilePath(newFileName);

      if (!fs.existsSync(oldPath)) {
        consola.warn(`Skipped rename, file not found: ${oldFileName}`);
        return;
      }

      fs.ensureDirSync(path.dirname(newPath));
      fs.renameSync(oldPath, newPath);
    });
  }

  /**
   * Replace contents of files safely
   * @param {Array<{
   *  fileName: string;
   *  replacements: Array<{
   *    searchValue: string | RegExp;
   *    replaceValue: string;
   *  }>
   * }>} files
   */
  replaceFilesContent(files) {
    files.forEach(({ fileName, replacements }) => {
      const absolutePath = this.getAbsoluteFilePath(fileName);

      if (!fs.existsSync(absolutePath)) {
        consola.warn(`Skipped content update, file not found: ${fileName}`);
        return;
      }

      let content = fs.readFileSync(absolutePath, 'utf-8');

      replacements.forEach(({ searchValue, replaceValue }) => {
        content = content.replace(searchValue, replaceValue);
      });

      fs.writeFileSync(absolutePath, content);
    });
  }
}

module.exports = ProjectFilesManager;
