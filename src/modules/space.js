import fs from "fs";
import matter from "gray-matter";

export default class Space {
  #filePath = "";
  #fileName = "";
  #title = "";
  #date = "";

  /**
   * @param {string} filePath Path to file location e.g. /path/to/file.md
   * @param {string} fileName File name e.g. file.md
   * @param {string} title Space's title
   * @param {string} date Space's creation date
   */
  constructor(filePath, fileName, title, date, isExists) {
    this.#filePath = filePath;
    this.#fileName = fileName;
    this.#title = title;
    this.#date = date;
  }

  get filePath() {
    return this.#filePath;
  }

  get fileName() {
    return this.#fileName;
  }

  get title() {
    return this.#title;
  }

  get date() {
    return this.#date;
  }

  get isExists() {
    return fs.existsSync(this.#filePath);
  }

  /**
   * Transforming `content` into markdown with gray-matter.
   *
   * @param {string|any} content
   * @returns string
   */
  #toMarkdown(content) {
    return matter.stringify(
      { content: content || `---\n# ${this.#title}` },
      {
        title: this.#title,
        date: this.#date,
      }
    );
  }

  /**
   * Serialize space instance into an actual file.
   *
   * @param {?string} content
   * @param {boolean} override Force write
   * @returns boolean
   */
  save(content = null, override = false) {
    if (this.isExists && !override) {
      return false;
    }

    const fileBuffer = this.#toMarkdown(content);
    fs.writeFileSync(this.#filePath, fileBuffer, { encoding: "utf-8" });

    return true;
  }

  toString() {
    return this.#toMarkdown();
  }
}
