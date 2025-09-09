/**
 * Converts a string to Sentence case.
 * Example: "sales order" -> "Sales order"
 * @param {string} text
 * @returns {string}
 */
function toSentenceCase(text) {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Converts a camelCase or space-separated string to Capital Case.
 * Example: "salesOrder" -> "Sales Order"
 * @param {string} text
 * @returns {string}
 */
function toCapitalCase(text) {
    if (!text) return '';
    // Add a space before any uppercase letter and then capitalize each word
    return text
        .replace(/([A-Z])/g, ' $1')
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Converts a camelCase string to lowercase.
 * Example: "salesOrder" -> "sales order"
 * @param {string} test 
 * @returns {string}
 */
function toLowercase(test) {
    return toSentenceCase(test).toLowerCase();
}

module.exports = {
    toSentenceCase,
    toCapitalCase,
    toLowercase
};

