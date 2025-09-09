const fs = require('fs');
const path = require('path');
const { updateScoroNodeFile, addResourceToRoutingMap } = require('./scoroNodeScripts.js');
const { generateResourceFiles } = require('./fileGenerator.js');

// --- Argument Parsing ---
const [singular, plural, pascalCase, pascalCasePlural] = process.argv.slice(2);
if (!singular || !plural || !pascalCase || !pascalCasePlural) {
    console.error('Usage: npm run generate -- <singular> <plural> <PascalCase> <PascalCasePlural>');
    process.exit(1);
}

// --- Path Definitions ---
const basePath = path.join(__dirname, '..', 'nodes', 'Scoro');
const resourcesPath = path.join(basePath, 'resources');
const listSearchPath = path.join(basePath, 'listSearch');
const executePath = path.join(basePath, 'execute'); // New path
const templatesPath = path.join(__dirname, '..', '_templates');
const mainNodeFile = path.join(basePath, 'Scoro.node.ts');
const routingMapFile = path.join(executePath, 'routingMap.ts'); // New path

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


// 3. Read the routing map file and add the new resource
let routingMapContent = fs.readFileSync(routingMapFile, 'utf8');
routingMapContent = addResourceToRoutingMap(routingMapContent, { singular, plural });
fs.writeFileSync(routingMapFile, routingMapContent, 'utf8');
console.log(`✅ Successfully updated execute/routingMap.ts.`);


console.log(`\n🎉 All done! Resource '${singular}' has been generated and integrated.`);