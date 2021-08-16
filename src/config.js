import fs from "fs";
import os from "os";
import path from "path";
import { moveFileSync } from "move-file";

const CONFIG_PATH = path.join(os.homedir(), ".config", "myspace");
const CONFIG_FILE = path.join(CONFIG_PATH, "config.json");
const CONFIG_FALLBACK = {
  workspaceDirectory: path.join(os.homedir(), "myspace"),
  spaceDateFormat: "YYYY-MM-DD",
  spaceFileName: "space.md",
  typoraExecutable: "/usr/bin/typora",
};

/**
 * Create a new config file.
 *
 * @param {object} newConfig An object that indicating new configuration data
 * @param {boolean} backupExisting Whether perform a backup or not
 */
function createNew(newConfig, backupExisting = false) {
  if (backupExisting) {
    // TODO: Should I considering the error possibility?
    //        Though the flag `backupExisting` should be called only
    //          when specific condition is happening.
    moveFileSync(CONFIG_FILE, path.join(CONFIG_PATH, "config.bak.json"));
  }

  fs.writeFileSync(CONFIG_FILE, JSON.stringify(newConfig, null, 4));
}

export function getConfig() {
  let config = { ...CONFIG_FALLBACK };

  fs.mkdirSync(CONFIG_PATH, { recursive: true });

  /**
   * Creating new config file because none exists
   */
  if (!fs.existsSync(CONFIG_FILE)) {
    createNew(config);

    return config;
  }

  /** Try to load config from existing existing config file */
  const buffer = fs.readFileSync(CONFIG_FILE, { encoding: "utf-8" });
  const existingConfigContent = JSON.parse(buffer);

  let unmatchKeys = 0;
  Object.keys(config).forEach((validConfigKey) => {
    if (!(validConfigKey in existingConfigContent)) {
      unmatchKeys++;
      return;
    }

    config[validConfigKey] = existingConfigContent[validConfigKey];
  });

  if (!fs.existsSync(config.typoraExecutable)) {
    throw new Error(`File: ${config.typoraExecutable} does not exists!`);
  }

  /** Check if given config is actually an executable binary (Unix) */
  if (fs.statSync(config.typoraExecutable).mode !== 0o100755) {
    throw new Error(`File: ${config.typoraExecutable} is not executable!`);
  }

  /**
   * Creating new config file and backup the existing one,
   *  because it already outdated (invalid).
   */
  if (unmatchKeys > 0) {
    createNew(config, true);
  }

  return config;
}
