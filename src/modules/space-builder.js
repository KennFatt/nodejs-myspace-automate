import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Space from "./space.js";
import moment from "moment";

export default class SpaceBuilder {
  #filePath = "";
  #fileName = "space.md";
  #title = "Today's Space";
  #date = "";

  constructor() {}

  #validateSetters() {
    if (this.#filePath === "") {
      throw new Error("File path could not be empty!");
    }

    if (path.extname(this.#fileName).toLocaleLowerCase() !== ".md") {
      this.#fileName += ".md";
    }
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

  setFilePath(filePath) {
    if (typeof filePath === "string" && filePath.length > 0) {
      this.#filePath = filePath;

      if (path.extname(filePath).toLowerCase() === ".md") {
        this.#fileName = path.basename(filePath);
      }
    }

    return this;
  }

  setTitle(title) {
    if (typeof title === "string" && title.length > 0) {
      this.#title = title;
    }

    return this;
  }

  setDate(date) {
    // The only valid date value is YYYY-MM-DD (which consist of 10 characters)
    if (typeof date === "string" && date.length === 10) {
      this.#date = date;
    }

    return this;
  }

  loadMetadata = () => {
    if (this.#filePath === "") {
      return this;
    }

    if (!fs.existsSync(this.#filePath)) {
      return this;
    }

    const fileContent = fs.readFileSync(this.#filePath, { encoding: "utf-8" });
    const metadata = matter(fileContent)?.data;

    this.#title = metadata?.title;
    this.#date = moment(metadata?.date).format("YYYY-MM-DD");

    return this;
  };

  build = () => {
    this.#validateSetters();

    return new Space(this.#filePath, this.#fileName, this.#title, this.#date);
  };
}
