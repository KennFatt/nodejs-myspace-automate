#!/usr/bin/env node
import { spawn } from "child_process";
import { getConfig } from "./config.js";
import { Workspace } from "./lib.js";

(function main() {
  const config = getConfig();
  const workspace = new Workspace({
    workspaceDirectory: config.workspaceDirectory,
    dateFormat: config.spaceDateFormat,
    fileName: config.spaceFileName,
  });

  try {
    workspace.updateDailySpace();

    spawn(config.typoraExecutable, [workspace.space.filePath], {
      stdio: "ignore",
      detached: true,
    }).unref();
  } catch (e) {
    console.error(e);
  }
})();
