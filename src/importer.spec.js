import fs from "node:fs";
import process from "node:process";

import { compileString } from "sass";
import { jest } from "@jest/globals";
import { moduleImporter } from "./importer";

it("should be able to transform scss using package without exports and main fields", () => {
    const spyProcess = jest.spyOn(process, "cwd");

    spyProcess.mockReturnValue("./fixtures");

    const result = compileString(
        fs.readFileSync("./fixtures/main.scss", "utf-8"),
        {
            style: "expanded",
            importers: [moduleImporter],
        },
    );
    expect(result.css).toMatchSnapshot();
});

it("should be able to transform scss using package with exports", () => {
    const spyProcess = jest.spyOn(process, "cwd");

    spyProcess.mockReturnValue("./fixtures");

    const result = compileString(
        fs.readFileSync("./fixtures/exports.scss", "utf-8"),
        {
            style: "expanded",
            importers: [moduleImporter],
        },
    );
    expect(result.css).toMatchSnapshot();
});

it("should be able to transform scss using package with main field", () => {
    const spyProcess = jest.spyOn(process, "cwd");

    spyProcess.mockReturnValue("./fixtures");

    const result = compileString(
        fs.readFileSync("./fixtures/mainField.scss", "utf-8"),
        {
            style: "expanded",
            importers: [moduleImporter],
        },
    );
    expect(result.css).toMatchSnapshot();
});

it("should be able to transform scss using package with sass fields", () => {
    const spyProcess = jest.spyOn(process, "cwd");

    spyProcess.mockReturnValue("./fixtures");

    const result = compileString(
        fs.readFileSync("./fixtures/sassField.scss", "utf-8"),
        {
            style: "expanded",
            importers: [moduleImporter],
        },
    );
    expect(result.css).toMatchSnapshot();
});
