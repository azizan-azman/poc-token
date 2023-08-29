const StyleDictionary = require("style-dictionary");
const {
  registerTransforms,
  transforms,
} = require("@tokens-studio/sd-transforms");
const { promises } = require("node:fs");

registerTransforms(StyleDictionary, {
  expand: {
    composition: true,
    typography: false,
    border: false,
    shadow: false,
  },
  excludeParentKeys: true,
});

StyleDictionary.registerTransformGroup({
  name: "custom/tokens-studio",
  transforms: [...transforms, "attribute/cti", "name/cti/kebab"],
});

const tokenFilter = (category, type) => (token) => {
  console.log("category is", category);
  console.log("token is", token);
  return token.original.type === type && token.path[0] === category;
};

const generateFilesArr = (tokensKeys, theme) => {
  //   console.log("tokensKeys is", tokensKeys);
  const tokenSetCategory = Object.keys(tokensKeys[theme])[0];
  console.log("tokensetCategory is", tokenSetCategory);
  const tokenSetTypes = Object.keys(tokensKeys[theme][tokenSetCategory]);
  console.log("tokenSetTypes is", tokenSetTypes);
  return tokenSetTypes.map((type) => ({
    filter: tokenFilter(tokenSetCategory, type),
    destination:
      theme === "global"
        ? `my-build2/${theme}/_${theme.toLowerCase()}.${type}.scss`
        : `my-build2/themes/${theme}/_${theme.toLowerCase()}.${type}.scss`,
    format: "scss/variables",
    options: {
      outputReferences: true,
      fileHeader: "autoGeneratedFileHeader",
    },
  }));
};

async function run() {
  const $tokenSetOrder = JSON.parse(
    await promises.readFile(
      "tokens-example/free/single-file/test-tokens/cti.tokens.json"
    )
  );

  const myconfigs = $tokenSetOrder.$metadata.tokenSetOrder.map((theme) => {
    console.log("theme is", theme);

    return {
      source: ["tokens-example/free/single-file/test-tokens/cti.tokens.json"],
      fileHeader: {
        autoGeneratedFileHeader: () => {
          return [`Do not edit directly, this file was auto-generated`];
        },
      },
      platforms: {
        css: {
          transformGroup: "custom/tokens-studio",
          files: generateFilesArr($tokenSetOrder, theme),
        },
      },
    };
  });

  myconfigs.forEach((cfg) => {
    const sd = StyleDictionary.extend(cfg);
    sd.cleanAllPlatforms();
    sd.buildAllPlatforms();
  });
}
run();
