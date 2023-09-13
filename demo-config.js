const StyleDictionary = require("style-dictionary");
const {
  registerTransforms,
  transforms,
} = require("@tokens-studio/sd-transforms");
const { promises } = require("node:fs");

registerTransforms(StyleDictionary, {
  expand: {
    composition: true,
    typography: true,
    border: false,
    shadow: false,
  },
  excludeParentKeys: false,
});

StyleDictionary.registerTransformGroup({
  name: "custom/tokens-studio",
  transforms: [...transforms, "attribute/cti", "name/cti/kebab"],
});

const tokenFilter = (type, theme) => (token) => {
  const filePath = `demo-tokens/${theme}.json`;
  return theme === "global"
    ? token.filePath === filePath
    : token.filePath === filePath;
};

const generateFilesArr = (data, theme) => {
  const tokenSetCategory = Object.keys(data)[0];
  const tokenSetTypes = Object.keys(data[tokenSetCategory]);
  return tokenSetTypes.map((type) => ({
    filter: tokenFilter(type, theme),
    destination:
      theme === "global"
        ? `my-demo-build/${theme}/_${theme.toLowerCase()}.scss`
        : `scss/themes/${theme}/_themes.${theme.toLowerCase()}.scss`,
    format: "scss/variables",
    options: {
      outputReferences: true,
      fileHeader: "autoGeneratedFileHeader",
    },
  }));
};

async function readTokenFile(tokenType) {
  const filePath = `demo-tokens/${tokenType}.json`;
  try {
    const fileContent = await promises.readFile(filePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error reading or parsing file: ${filePath}`, error);
    return null; // or throw an error if desired
  }
}

async function run() {
  const $tokenSetOrder = JSON.parse(
    await promises.readFile("demo-tokens/$metadata.json")
  );
  const myconfigsPromises = $tokenSetOrder.tokenSetOrder.map(
    async (tokenSet) => {
      const data = await readTokenFile(tokenSet);

      return {
        source:
          tokenSet === "global"
            ? [`demo-tokens/global.json`]
            : [`demo-tokens/global.json`, `demo-tokens/${tokenSet}.json`],
        fileHeader: {
          autoGeneratedFileHeader: () => {
            return [`Do not edit directly, this file was auto-generated`];
          },
        },
        platforms: {
          css: {
            transformGroup: "custom/tokens-studio",
            files: generateFilesArr(data, tokenSet),
          },
        },
      };
    }
  );

  const myconfigs = await Promise.all(myconfigsPromises);

  myconfigs.forEach((cfg) => {
    const sd = StyleDictionary.extend(cfg);
    sd.cleanAllPlatforms();
    sd.buildAllPlatforms();
  });
}
run();
