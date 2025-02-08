import fs from "node:fs";
import process from "node:process";

import { compileString } from "sass";
import { jest } from "@jest/globals";
import { moduleImporter } from "./importer";

function init(mainEntry) {
    const spyProcess = jest.spyOn(process, "cwd");

    spyProcess.mockReturnValue("./fixtures");

    return compileString(fs.readFileSync(`./fixtures/${mainEntry}`, "utf-8"), {
        style: "expanded",
        importers: [moduleImporter],
    }).css;
}

it("should be able to transform scss using package without exports and main fields", () => {
    expect(init("main.scss")).toMatchSnapshot();
});

it("should be able to transform scss using package with exports", () => {
    expect(init("exports.scss")).toMatchSnapshot();
});

it("should be able to transform scss using package with main field", () => {
    expect(init("mainField.scss")).toMatchSnapshot();
});

it("should be able to transform scss using package with sass fields", () => {
    expect(init("sassField.scss")).toMatchSnapshot();
});
