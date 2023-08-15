const coreAndSemanticTokens = ["color"];
const componentTokens = ["button"];
const sdToFigma = require("@divriots/style-dictionary-to-figma").default;

const tokenFilter = (cat) => (token) => {
  const { category, type } = token.attributes;
  return ["core", "semantic"].includes(category)
    ? type === cat
    : category === cat;
};

const generateFilesArr = (tokensCategories, ext, format) => {
  return tokensCategories.map((cat) => {
    return {
      filter: tokenFilter(cat),
      destination: `${cat}/src/${cat}.tokens.${ext}`,
      format,
    };
  });
};

module.exports = {
  source: ["**/*.tokens.json"],
  format: {
    figmaTokensPluginJson: (opts) => {
      const { dictionary } = opts;
      const parsedTokens = sdToFigma(dictionary.tokens);
      return JSON.stringify(parsedTokens, null, 2);
    },
  },
  platforms: {
    css: {
      transformGroup: "css",
      prefix: "starter",
      buildPath: "",
      files: generateFilesArr(
        [...coreAndSemanticTokens, ...componentTokens],
        "css",
        "css/variables"
      ),
    },
    scss: {
      transformGroup: "css",
      prefix: "starter",
      buildPath: "",
      files: generateFilesArr(coreAndSemanticTokens, "scss", "scss/variables"),
    },
    js: {
      transformGroup: "js",
      prefix: "starter",
      buildPath: "",
      files: generateFilesArr(coreAndSemanticTokens, "js", "javascript/es6"),
    },
    json: {
      transformGroup: "js",
      buildPath: "",
      files: [
        { destination: "figma-tokens.json", format: "figmaTokensPluginJson" },
      ],
    },
  },
};
