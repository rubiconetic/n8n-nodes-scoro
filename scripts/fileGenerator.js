const fs = require('fs');
const path = require('path');
const { toSentenceCase, toCapitalCase, toLowercase } = require('./caseHelpers.js');

/**
 * Reads an index file, adds a new export line, sorts all lines, and overwrites the file.
 * @param {string} filePath The path to the index.ts file.
 * @param {string} newLine The new export line to add.
 */
function updateIndexFile(filePath, newLine) {
    let lines = [];
    if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        lines = fileContent.split('\n').filter(line => line.trim() !== '');
    }

    if (!lines.includes(newLine)) {
        lines.push(newLine);
    }

    lines.sort((a, b) => a.localeCompare(b));

    const newContent = lines.join('\n') + '\n';
    fs.writeFileSync(filePath, newContent, 'utf8');
}

/**
 * Generates all necessary resource files from templates and updates index files.
 * @param {object} names An object with name variations.
 * @param {string} names.singular
 * @param {string} names.plural
 * @param {string} names.pascalCase
 * @param {string} names.pascalCasePlural
 * @param {object} paths An object with necessary directory paths.
 * @param {string} paths.resourcesPath
 * @param {string} paths.listSearchPath
 * @param {string} paths.templatesPath
 */
function generateResourceFiles(
    { singular, plural, pascalCase, pascalCasePlural },
    { resourcesPath, listSearchPath, templatesPath },
) {
    // --- Create Case Variations ---
    const sentenceCase = toSentenceCase(singular);
    const sentenceCasePlural = toSentenceCase(plural);
    const capitalCase = toCapitalCase(singular);
    const capitalCasePlural = toCapitalCase(plural);
    const lowercase = toLowercase(singular);
    const lowercasePlural = toLowercase(plural);

    // --- Create new resource directory and files ---
    const resourceTemplatePath = path.join(templatesPath, 'resource');
    const newResourcePath = path.join(resourcesPath, singular);

    if (!fs.existsSync(newResourcePath)) {
        fs.mkdirSync(newResourcePath);
    }

    fs.readdirSync(resourceTemplatePath).forEach((file) => {
        let content = fs.readFileSync(path.join(resourceTemplatePath, file), 'utf8');
        content = content
            .replace(/__resource_singular__/g, singular)
            .replace(/__resource_plural__/g, plural)
            .replace(/__Resource_PascalCase__/g, pascalCase)
            .replace(/__Resource_PascalCase_Plural__/g, pascalCasePlural)
            .replace(/__Resource_Sentence_Case__/g, sentenceCase)
            .replace(/__Resource_Sentence_Case_Plural__/g, sentenceCasePlural)
            .replace(/__Resource_Capital_Case__/g, capitalCase)
            .replace(/__Resource_Capital_Case_Plural__/g, capitalCasePlural)
            .replace(/__Resource_Lowercase__/g, lowercase)
            .replace(/__Resource_Lowercase_Plural__/g, lowercasePlural);
        fs.writeFileSync(path.join(newResourcePath, file), content);
    });

    // --- Create new listSearch file ---
    let listSearchContent = fs.readFileSync(path.join(templatesPath, 'listSearch.ts'), 'utf8');
    listSearchContent = listSearchContent
        .replace(/__resource_singular__/g, singular)
        .replace(/__resource_plural__/g, plural)
        .replace(/__Resource_PascalCase__/g, pascalCasePlural);
    fs.writeFileSync(path.join(listSearchPath, `get${pascalCasePlural}.ts`), listSearchContent);


    // --- Update index files ---
    updateIndexFile(path.join(resourcesPath, 'index.ts'), `export * from './${singular}';`);

    updateIndexFile(path.join(listSearchPath, 'index.ts'), `export * from './get${pascalCasePlural}';`);

    console.log(`✅ Successfully generated files for resource '${singular}'.`);
}

module.exports = {
    generateResourceFiles,
};