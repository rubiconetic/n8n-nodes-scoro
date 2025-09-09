const fs = require('fs');
const path = require('path');
const { updateScoroNodeFile } = require('./scoroNodeScripts.js');
const { generateResourceFiles } = require('./fileGenerator.js');

// --- Argument Parsing ---
const [singular, plural, pascalCase, pascalCasePlural] = process.argv.slice(2);
if (!singular || !plural || !pascalCase || !pascalCasePlural) {
    console.error('Usage: npm run generate -- <singular> <plural> <PascalCase> <PascalCase Plural>');
    process.exit(1);
}

// --- Path Definitions ---
const basePath = path.join(__dirname, '..', 'nodes', 'Scoro');
const resourcesPath = path.join(basePath, 'resources');
const listSearchPath = path.join(basePath, 'listSearch');
const templatesPath = path.join(__dirname, '..', '_templates');
const mainNodeFile = path.join(basePath, 'Scoro.node.ts');

// --- Main Execution ---

// 1. Generate all the new files from templates
generateResourceFiles(
    { singular, plural, pascalCase, pascalCasePlural },
    { resourcesPath, listSearchPath, templatesPath },
);

// 2. Read the main node file and apply modifications
let nodeContent = fs.readFileSync(mainNodeFile, 'utf8');
nodeContent = updateScoroNodeFile(nodeContent, {
    singular,
    plural,
    pascalCase,
    pascalCasePlural,
});
fs.writeFileSync(mainNodeFile, nodeContent, 'utf8');
console.log(`✅ Successfully updated Scoro.node.ts.`);

console.log(`\n🎉 All done! Resource '${singular}' has been generated and integrated.`);