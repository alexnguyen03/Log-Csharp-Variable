const typeColors = {
    debug: { fg: "\x1b[36m", bg: "\x1b[44m", icon: "$(bug)" },        // cyan + blue bg
    info: { fg: "\x1b[32m", bg: "\x1b[42m", icon: "$(pass)" },       // green + green bg
    error: { fg: "\x1b[31m", bg: "\x1b[41m", icon: "$(error)" },      // red + red bg
} as const;

const VALID_PLACEHOLDERS = {
    "{prefix}": true,
    "{type}": true,
    "{varLine}": true,
    "{timeLine}": true,
    "{pathLine}": true,
} as const;
export { typeColors, VALID_PLACEHOLDERS };