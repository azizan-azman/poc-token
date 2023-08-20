const StyleDictionary = require("style-dictionary");
const { registerTransforms } = require("@tokens-studio/sd-transforms");

// sd-transforms, 2nd parameter for options can be added
// See docs: https://github.com/tokens-studio/sd-transforms
registerTransforms(StyleDictionary, {
  expand: {
    composition: true,
    typography: false,
    border: false,
    shadow: false,
  },
  excludeParentKeys: true,
});

// example value transform, which just returns the token as is
StyleDictionary.registerTransform({
  type: "value",
  name: "myCustomTransform",
  matcher: (token) => {},
  transformer: (token) => {
    return token; // <-- transform as needed
  },
});

// format helpers from style-dictionary
const { fileHeader, formattedVariables } = StyleDictionary.formatHelpers;

// example css format
StyleDictionary.registerFormat({
  name: "myCustomFormat",
  formatter: function ({ dictionary, file, options }) {
    const { outputReferences } = options;
    return `
${formattedVariables({ format: "scss", dictionary, outputReferences })}
`;
  },
});

const sd = StyleDictionary.extend({
  source: ["**/*.tokens.json"],
  platforms: {
    scss: {
      transformGroup: "tokens-studio",
      prefix: "sd",
      buildPath: "sd-output/scss/",
      files: [
        {
          destination: "_variables.scss",
          format: "scss/variables",
        },
      ],
    },
  },
});
sd.cleanAllPlatforms(); // optionally, cleanup files first..
sd.buildAllPlatforms();
