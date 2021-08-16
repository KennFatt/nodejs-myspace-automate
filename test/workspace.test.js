import assert from "assert/strict";
import fs from "fs";
import os from "os";
import path from "path";
import moment from "moment";
import { Workspace } from "../src/lib.js";

describe("Workspace", () => {
  const workspaceConfig = {
    workspaceDirectory: path.join(os.tmpdir(), "myspace-workspace-test"),
    dateFormat: "YYYY-MM-DD",
    fileName: "myspace-test.md",
  };

  after(() => {
    fs.rmSync(workspaceConfig.workspaceDirectory, { recursive: true });
  });

  describe("New workspace", () => {
    const workspace = new Workspace(workspaceConfig);

    describe("properties", () => {
      it("#workspaceConfig should be equal to `workspaceConfig`", () => {
        assert.deepStrictEqual(workspace.workspaceConfig, workspaceConfig);
      });

      it("#workspacePath should be equal to `workspaceConfig.workspaceDirectory`", () => {
        assert.strictEqual(
          workspace.workspacePath,
          workspaceConfig.workspaceDirectory
        );
      });

      it("#space should not be null", () => {
        assert.ok(workspace.space !== null);
      });

      it("#space.isExists should be false", () => {
        assert.strictEqual(workspace.space.isExists, false);
      });

      it("#archiveFilePath should be equal to today", () => {
        const archiveFilePath = path.join(
          workspaceConfig.workspaceDirectory,
          "archived_spaces",
          `${moment().format(workspaceConfig.dateFormat)}_${
            workspace.space.title
          }${path.extname(workspace.space.fileName)}`
        );

        assert.strictEqual(workspace.archiveFilePath, archiveFilePath);
      });
    });
    // end-of "properties"

    describe("methods", () => {
      afterEach(() => {
        if (fs.existsSync(workspace.archiveFilePath)) {
          fs.rmSync(workspace.archiveFilePath);
        }

        if (fs.existsSync(workspace.space.filePath)) {
          fs.rmSync(workspace.space.filePath);
        }
      });

      it("archive() should throw an error because space file does not exists just yet", () => {
        assert.throws(workspace.archive, {
          name: "Error",
          message: "Could not archive the space because it does not exists!",
        });
      });

      it("updateDailySpace() should be working just fine", () => {
        assert.doesNotThrow(workspace.updateDailySpace);
      });

      it("#workspace.space.isExists after updateDailySpace() should be true", () => {
        workspace.updateDailySpace();
        assert.ok(workspace.space.isExists);
      });

      it("updateDailySpace() twice NOT should be generating archive file", () => {
        workspace.updateDailySpace();
        workspace.updateDailySpace();
        assert.ok(!fs.existsSync(workspace.archiveFilePath));
      });
    });
    // end-of "methods"
  });
});
