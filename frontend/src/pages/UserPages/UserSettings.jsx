import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import OrgNavBar from "../../components/NavBar.jsx";
import "../../styles/OrganizationSettings.css";

export default function OrganizationSettings() {

  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className={`settings-page ${theme}`}>
      <OrgNavBar />

      <div className="settings-container">
        <h1>Settings Page</h1>

        <button onClick={toggleTheme}>
          Switch to {theme === "light" ? "Dark" : "Light"} Mode
        </button>
      </div>
    </div>
  );
}