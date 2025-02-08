import path from "node:path";
import fs from "node:fs";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import resolvePackagePath from "resolve-package-path";
import { exports, legacy } from "resolve.exports";
import { getPackageNameFromPath } from "./parsePackageName";

const require = createRequire(import.meta.url);
const WEBPACK_NODE_MODULE_PREFIX = "~";
export const moduleImporter = {
    findFileUrl(url) {
        let findUrl = url;
        if (url.startsWith(WEBPACK_NODE_MODULE_PREFIX)) {
            findUrl = url.substring(1);
        }

        const packageName = getPackageNameFromPath(findUrl);

        const fileName = findUrl.split(packageName)[1];
        const packagePath = resolvePackagePath(packageName, process.cwd());

        /* Validate if existing package */
        if (!packagePath) {
            return null;
        }

        const packageJson = JSON.parse(
            fs.readFileSync(packagePath, { encoding: "utf-8" }),
        );

        const directory = path.dirname(packagePath);

        /* Check exports */
        try {
            const match = exports(packageJson, fileName, {
                conditions: ["sass"],
            });

            if (match && match.length === 1) {
                return new URL(pathToFileURL(path.join(directory, match[0])));
            }
        } catch {
            /* empty */
        }

        /* Check main fields */
        const match = legacy(packageJson, { fields: ["sass", "main"] });
        console.log(match);

        if (match) {
            console.log(path.join(directory, match));
            return new URL(pathToFileURL(path.join(directory, match)));
        }

        /* Direct link */
        const search = [
            `${fileName}.css`,
            `${fileName}.scss`,
            `_${fileName}.scss`,
            `${fileName}`,
        ];

        for (const variant of search) {
            try {
                const moduleName = path.posix.join(directory, variant);
                const resolved = require.resolve(moduleName);
                return new URL(pathToFileURL(resolved));
            } catch (err) {
                if (err.code !== "MODULE_NOT_FOUND") {
                    throw err;
                }
            }
        }
        return null;
    },
};
