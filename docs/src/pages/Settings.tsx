import React from "react";
import { useThemeAndLanguages } from "../contexts/ThemeAndLangaugesProvider";

const Settings: React.FC = () => {
	const { theme, setTheme, language, setLanguage } = useThemeAndLanguages();
	
	return (
		<div>
			<h3>Settings</h3>
			<div>
			<label>Theme: </label>
			<select aria-label="Theme" value={theme} onChange={(e) => setTheme(e.target.value)}>
				<option value="monokai">Monokai</option>
				<option value="github">Github</option>
				<option value="tomorrow">Tomorrow</option>
				<option value="kuroir">Kuroir</option>
				<option value="twilight">Twilight</option>
				<option value="xcode">Xcode</option>
				<option value="solarized dark">Solarized Dark</option>
				<option value="solarized light">Solarized Light</option>
				<option value="terminal">Terminal</option>
			</select>
			</div>
			<div>
				<label>Langauge:</label>
				<select aria-label="Language" value={language} onChange={(e) => setLanguage(e.target.value)}>
					<option value="java">Java</option>
					<option value="python">Python</option>
					<option value="javascript">Javascript</option>
				</select>
			</div>
		</div>
	);
};

export default Settings;