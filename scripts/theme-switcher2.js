// Initialize themes as an empty array
let themes = ["blue"];

const body = document.querySelector("body");
body.setAttribute("class", "theme-blue");

// Function to populate the theme dropdown
function populateThemeDropdown() {
  const themeDropdown = document.getElementById("theme");
  themes.forEach((theme) => {
    if (theme !== "global") {
      const option = document.createElement("option");
      option.value = theme;
      option.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
      themeDropdown.appendChild(option);
    }
  });
}

// Function to change the theme based on the selected option
function changeTheme(selectedTheme) {
  const body = document.querySelector("body");
  body.setAttribute("class", `theme-${selectedTheme}`);
}

// Event listener for theme dropdown change
document.addEventListener("DOMContentLoaded", async () => {
  // Load the JSON file and update the themes array
  try {
    const response = await fetch("demo-tokens/$metadata.json");
    const data = await response.json();

    // Assuming your JSON file contains an array of themes under a key 'themes'
    themes = data.tokenSetOrder;

    populateThemeDropdown();

    const themeSelector = document.getElementById("theme");
    themeSelector.addEventListener("change", () => {
      const selectedTheme = themeSelector.value;
      changeTheme(selectedTheme);
    });
  } catch (error) {
    console.error("Error loading JSON file:", error);
  }
});
