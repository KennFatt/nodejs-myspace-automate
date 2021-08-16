import assert from "assert/strict";
import { SpaceBuilder } from "../src/lib.js";

describe("SpaceBuilder", () => {
  const spaceBuilder = new SpaceBuilder();

  describe("properties", () => {
    it("#filePath should be empty string", () => {
      assert.strictEqual(spaceBuilder.filePath, "");
    });

    it("#fileName should be `space.md`", () => {
      assert.strictEqual(spaceBuilder.fileName, "space.md");
    });

    it("#title should be `Today's Space`", () => {
      assert.strictEqual(spaceBuilder.title, "Today's Space");
    });

    it("#date should be a string", () => {
      assert.strictEqual(typeof spaceBuilder.date, "string");
    });

    it("#date must be an empty string by default", () => {
      assert.strictEqual(spaceBuilder.date, "");
    });
  });

  describe("methods", () => {
    it("build() should throw an error when #filePath is empty", () => {
      assert.throws(spaceBuilder.build, {
        name: "Error",
        message: "File path could not be empty!",
      });
    });

    it("setFilePath() then build() should not throwing any error", () => {
      assert.doesNotThrow(spaceBuilder.setFilePath("dummy").build);
    });
  });
});
