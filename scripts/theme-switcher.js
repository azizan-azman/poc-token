// Array of available themes
const themes = ["yellow", "blue"];

const body = document.querySelector("body");
body.setAttribute("class", "theme-yellow");

// Function to populate the theme dropdown
function populateThemeDropdown() {
  const themeDropdown = document.getElementById("theme");

  themes.forEach((theme) => {
    const option = document.createElement("option");
    option.value = theme;
    option.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
    themeDropdown.appendChild(option);
  });
}

// Function to change the theme based on the selected option
function changeTheme(selectedTheme) {
  const body = document.querySelector("body");
  body.setAttribute("class", `theme-${selectedTheme}`);
}

// Event listener for theme dropdown change
document.addEventListener("DOMContentLoaded", () => {
  populateThemeDropdown();

  const themeSelector = document.getElementById("theme");
  themeSelector.addEventListener("change", () => {
    const selectedTheme = themeSelector.value;
    changeTheme(selectedTheme);
  });
});
