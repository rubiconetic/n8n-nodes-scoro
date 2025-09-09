/**
 * Finds the 'options' array in the node file content, adds a new resource object,
 * sorts the array alphabetically by name, and returns the updated content.
 * @param {string} content The original file content.
 * @param {string} newName The 'name' property for the new option (e.g., 'PascalCase').
 * @param {string} newValue The 'value' property for the new option (e.g., 'singular').
 * @returns {string} The updated file content.
 */
function addAndSortResourceOption(content, newName, newValue) {
    const resourceOptionsBlockRegex = /options: \[([\s\S]*?)\]/s;
    const blockMatch = content.match(resourceOptionsBlockRegex);

    if (!blockMatch) {
        console.warn('⚠️ Could not find resource options array. You may need to add it manually.');
        return content; // Return original content if block isn't found
    }

    const optionsContent = blockMatch[1];
    const originalBlock = blockMatch[0];

    // Parse existing options into an array of objects
    const optionRegex = /{\s*name:\s*'([^']*)',\s*value:\s*'([^']*)'/g;
    const options = [];
    let match;
    while ((match = optionRegex.exec(optionsContent)) !== null) {
        options.push({ name: match[1], value: match[2] });
    }

    // Add the new option and sort the array
    options.push({ name: newName, value: newValue });
    options.sort((a, b) => a.name.localeCompare(b.name));

    // Rebuild the options array string with proper formatting
    const newOptionsContent = options
        .map(
            (option) =>
                `\t\t\t\t\t{ name: '${option.name}', value: '${option.value}' },`,
        )
        .join('\n');

    const newBlock = `options: [\n${newOptionsContent}\n\t\t\t\t]`;

    // Replace the old block and return the updated content
    return content.replace(originalBlock, newBlock);
}

/**
 * Finds a specific named import statement, adds a new import, sorts them alphabetically,
 * and returns the updated content.
 * @param {string} content The original file content.
 * @param {string} newImport The new named import to add (e.g., 'taskDescription').
 * @param {string} modulePath The module path to target (e.g., './resources').
 * @returns {string} The updated file content.
 */
function addAndSortImport(content, newImport, modulePath) {
    const importRegex = new RegExp(`import {([^}]*?)} from '${modulePath}';`);
    const match = content.match(importRegex);

    if (!match) {
        console.warn(`⚠️ Could not find import from '${modulePath}'. Manual update may be needed.`);
        return content;
    }

    const originalStatement = match[0];
    const importsContent = match[1];

    // Parse the existing comma-separated imports into a clean array
    const imports = importsContent
        .split(',')
        .map(imp => imp.trim())
        .filter(imp => imp); // Filter out empty strings from trailing commas

    // Add the new import if it doesn't already exist, then sort
    if (!imports.includes(newImport)) {
        imports.push(newImport);
    }
    imports.sort((a, b) => a.localeCompare(b.name));

    // Rebuild the import statement with the sorted list
    const newStatement = `import {\n\t${imports.join(',\n\t')}\n} from '${modulePath}';`;

    // Replace the old statement with the new one and return
    return content.replace(originalStatement, newStatement);
}

/**
 * Adds a new spread property (e.g., '...taskDescription') to the 'properties' array and sorts it.
 * @param {string} content The original file content.
 * @param {string} newDescriptionName The name of the description to add (e.g., 'taskDescription').
 * @returns {string} The updated file content.
 */
function addAndSortDescription(content, newDescriptionName) {
    const regex = /(properties: \[\s*\{[\s\S]*?options: \[[\s\S]*?\],[\s\S]*?\},)([\s\S]*?)(\s*\])/s;
    const match = content.match(regex);

    if (!match) {
        console.warn('⚠️ Could not find the descriptions block in the properties array. Manual update needed.');
        return content;
    }

    const originalBlock = match[0];
    const prefix = match[1]; // Captures 'properties: [ { ... },'
    const descriptionsContent = match[2];
    const suffix = match[3]; // Captures ']'

    // Parse all existing descriptions into an array
    const descriptions = descriptionsContent.match(/\.\.\.\w+Description/g) || [];

    // Add the new description and sort the list
    const newDescription = `...${newDescriptionName}`;
    if (!descriptions.includes(newDescription)) {
        descriptions.push(newDescription);
    }
    descriptions.sort();

    // Rebuild the block of descriptions with proper indentation
    const newDescriptionsBlock = '\n' + descriptions.map(d => `\t\t\t${d}`).join(',\n') + '\n\t\t';

    const newContent = `${prefix}${newDescriptionsBlock}${suffix}`;
    return content.replace(originalBlock, newContent);
}

/**
 * Adds a new method to the 'listSearch' object and sorts it.
 * @param {string} content The original file content.
 * @param {string} newMethodName The name of the method to add (e.g., 'getTasks').
 * @returns {string} The updated file content.
 */
function addAndSortMethod(content, newMethodName) {
    const regex = /(listSearch: \{)([^}]*?)(\s*\})/s;
    const match = content.match(regex);

    if (!match) {
        console.warn('⚠️ Could not find the listSearch object. Manual update needed.');
        return content;
    }

    const originalBlock = match[0];
    const prefix = match[1]; // Captures 'listSearch: {'
    const methodsContent = match[2];
    const suffix = match[3]; // Captures '}'

    // Parse all existing method names into an array
    const methods = methodsContent.match(/\w+/g) || [];

    // Add the new method and sort the list
    if (!methods.includes(newMethodName)) {
        methods.push(newMethodName);
    }
    methods.sort();

    // Rebuild the block of methods with proper indentation
    const newMethodsBlock = '\n' + methods.map(m => `\t\t\t${m},`).join('\n') + '\n\t\t';

    const newContent = `${prefix}${newMethodsBlock}${suffix}`;
    return content.replace(originalBlock, newContent);
}


/**
 * Adds a new resource entry to the routingMap object in routingMap.ts.
 * @param {string} content The original file content of routingMap.ts.
 * @param {object} names An object with name variations.
 * @returns {string} The updated file content.
 */
function addResourceToRoutingMap(content, { singular, plural }) {
    const newRoute = `\t${singular}: {
\t\tcreate: { method: 'POST', url: '/${plural}/modify' },
\t\tdelete: { method: 'POST', url: '={{"/${plural}/delete/" + $parameter.${singular}Id}}' },
\t\tget: { method: 'POST', url: '={{"/${plural}/view/" + $parameter.${singular}Id}}' },
\t\tgetAll: { method: 'POST', url: '/${plural}/list' },
\t\tupdate: { method: 'POST', url: '/${plural}/modify' },
\t},`;

    // Find the closing brace of the routingMap object and insert the new route before it
    const lastBraceIndex = content.lastIndexOf('};');
    if (lastBraceIndex === -1) {
        console.warn('⚠️ Could not find the closing brace of routingMap. Manual update needed.');
        return content;
    }

    const part1 = content.substring(0, lastBraceIndex);
    const part2 = content.substring(lastBraceIndex);

    return `${part1}${newRoute}\n${part2}`;
}


/**
 * Runs the complete sequence of modifications on the Scoro.node.ts file content.
 * @param {string} content The original file content.
 * @param {object} names An object with name variations.
 * @returns {string} The fully updated file content.
 */
function updateScoroNodeFile(content, { singular, plural, pascalCase, pascalCasePlural }) {
    let nodeContent = content;

    // 1. Add resource description import
    nodeContent = addAndSortImport(nodeContent, `${singular}Description`, './resources');

    // 2. Add listSearch import
    nodeContent = addAndSortImport(nodeContent, `get${pascalCasePlural}`, './listSearch');

    // 3. Add resource option
    nodeContent = addAndSortResourceOption(nodeContent, pascalCase, singular);

    // 4. Add description to properties array
    nodeContent = addAndSortDescription(nodeContent, `${singular}Description`);

    // 5. Add method to listSearch object
    nodeContent = addAndSortMethod(nodeContent, `get${pascalCasePlural}`);

    return nodeContent;
}

module.exports = {
    updateScoroNodeFile,
    addResourceToRoutingMap,
};