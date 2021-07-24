"use strict"

const configPath = "sfdx-project.json";
const otherConfigPath = "other/sfdx-project.json";
const fs = require("fs");

if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath));
    const otherSfdxConfig = JSON.parse(fs.readFileSync(otherConfigPath));

    const projectName = config.packageDirectories[0].package;
    const newVersion = getSemverArray(config.packageDirectories[0].versionNumber);
    newVersion[2] += 1;

    config.packageAliases = Object.fromEntries([
        ...Object.entries(config.packageAliases),
        ...Object.entries(otherSfdxConfig.packageAliases)
    ].sort());

    const otherVersion = getSemverArray(otherSfdxConfig.packageDirectories[0].versionNumber);
    const latestVersion = getMaxVersion(newVersion, otherVersion).join(".");

    config.packageDirectories[0].versionNumber = `${latestVersion}.NEXT`;
    config.packageDirectories[0].versionName = `${projectName} ${latestVersion}`;

    const newSfdx = JSON.stringify(config, null, 2);
    console.log(newSfdx);
    // fs.writeFileSync("newsfdx.json", newSfdx);
} else {
    throw new Error(`Project config does't exist at ${configPath}!`);
}

function getMaxVersion(a1, a2) {
    console.log(`a1: ${a1}`);
    console.log(`a2: ${a2}`);
    for (let i = 0; i < a1.length; i++) {
        const v1 = a1[i];
        const v2 = a2[i];
        if (v1 !== v2 && v1 > v2) {
            return a1;
        } else {
            return a2;
        }
    }
    return a1;
}

function getSemverArray(o) {
    return o.replace(".NEXT", "")
        .split(".")
        .map(i => parseInt(i));
}