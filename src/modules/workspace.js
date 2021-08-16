import fs from "fs";
import path from "path";
import moment from "moment";
import { SpaceBuilder, Space } from "../lib.js";
import { moveFileSync } from "move-file";

export default class Workspace {
  #workspaceConfig = { workspaceDirectory: "", dateFormat: "", fileName: "" };

  #workspacePath = "";
  #archivesPath = "";
  #imagesPath = "";
  #archiveFilePath = "";

  /** @type {?Space} */
  #space = null;

  /**
   * Update workspace's space instance.
   *
   * @param {boolean} loadFromMetadata Whether should try to load metadata from existing space file
   */
  #updateSpace(loadFromMetadata = false) {
    const space = new SpaceBuilder()
      .setFilePath(
        path.join(this.#workspacePath, this.#workspaceConfig.fileName)
      )
      .setDate(moment().format(this.#workspaceConfig.dateFormat));

    if (loadFromMetadata) {
      space.loadMetadata();
    }

    this.#archiveFilePath = path.join(
      this.#archivesPath,
      `${space.date}_${space.title}${path.extname(space.fileName)}`
    );

    this.#space = space.build();
  }

  /**
   * @typedef WorkspaceConfig
   * @type {object}
   * @property {string} workspaceDirectory
   * @property {string} dateFormat
   * @property {string} fileName
   *
   * @param {WorkspaceConfig} config
   */
  constructor(config) {
    this.#workspaceConfig = config;

    this.#workspacePath = config.workspaceDirectory;
    this.#archivesPath = path.join(
      config.workspaceDirectory,
      "archived_spaces"
    );
    fs.mkdirSync(this.#archivesPath, { recursive: true });

    this.#imagesPath = path.join(config.workspaceDirectory, "uploaded_images");
    fs.mkdirSync(this.#imagesPath, { recursive: true });

    this.#updateSpace(true);
  }

  get workspaceConfig() {
    return this.#workspaceConfig;
  }

  get workspacePath() {
    return this.#workspacePath;
  }

  get archivesPath() {
    return this.#archivesPath;
  }

  get imagesPath() {
    return this.#imagesPath;
  }

  get archiveFilePath() {
    return this.#archiveFilePath;
  }

  get space() {
    return this.#space;
  }

  archive = () => {
    if (!this.#space.isExists) {
      throw new Error(
        "Could not archive the space because it does not exists!"
      );
    }

    if (fs.existsSync(this.#archiveFilePath)) {
      throw new Error("Archive file is already exists!");
    }

    moveFileSync(this.#space.filePath, this.#archiveFilePath);
  };

  updateDailySpace = () => {
    if (
      this.#space.isExists &&
      !(moment().format(this.#workspaceConfig.dateFormat) === this.#space.date)
    ) {
      this.archive();
    }

    this.#updateSpace();
    this.#space.save();
  };
}
