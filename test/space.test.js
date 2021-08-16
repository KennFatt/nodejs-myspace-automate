import assert from "assert/strict";
import fs from "fs";
import os from "os";
import path from "path";
import { SpaceBuilder } from "../src/lib.js";

describe("Space", () => {
  const _TestDir = path.join(os.tmpdir(), "myspace-test");
  const _TestFilePath = path.join(_TestDir, "space-test.md");
  const spaceBuilder = new SpaceBuilder();

  before(() => {
    fs.mkdirSync(_TestDir, { recursive: true });
  });

  after(() => {
    fs.rmSync(_TestDir, { recursive: true });
  });

  describe("methods", () => {
    beforeEach(() => {
      spaceBuilder.setFilePath(_TestFilePath);
    });

    it("toString() never ever returning empty string", () => {
      const space = spaceBuilder.build();
      assert.ok(space.toString().length > 0);
    });

    describe("save() and isExists", () => {
      it("save() method without params", () => {
        const space = spaceBuilder.build();
        assert.ok(space.save());
      });

      it("save() then isExists should be true", () => {
        const space = spaceBuilder.build();
        space.save();
        assert.ok(space.isExists);
      });

      it("save() twice without overriding flag given should return false", () => {
        const space = spaceBuilder.build();
        space.save();
        assert.ok(!space.save());
      });

      it("save() twice with overriding flag given should return true", () => {
        const space = spaceBuilder.build();
        space.save();
        assert.ok(space.save(null, true));
      });
    });
  });
});
