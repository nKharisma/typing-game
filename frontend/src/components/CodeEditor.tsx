import React, { useState, useEffect } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-ambiance";
import "ace-builds/src-noconflict/theme-chaos";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-github_dark";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/theme-kuroir";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/theme-solarized_dark";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/theme-clouds_midnight";
import '../css/CodeEditor.css'
import getBackendUrl from "../utils/getBackendUrl";

interface CodeEditorProps {
	language: string;
	initialTheme: string;
  filename: string;
	onRunCode: (code: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ language, initialTheme, filename, onRunCode }) => {
	const [code, setCode] = useState('');
	const [theme, setTheme] = useState(initialTheme);
	
	const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
	  setTheme(event.target.value);
	}

	const languageMode = language === "java" ? "java" : language === "python" ? "python" : "javascript";
  const extension = language === "java" ? ".java" : language === "python" ? ".py" : ".js";
	
      
  useEffect(() => {
    const fetchInitialCode = async () => {
      try {
        const response = await fetch(`${getBackendUrl()}/api/v1/user/get-puzzle`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({filename: `${filename}${extension}`})
        });
        const data = await response.json();
        setCode(data.getPuzzleResult.code); // Assume `data.code` contains the code from the API response
      } catch (error) {
        console.error("Failed to fetch initial code:", error);
      }
    };

    fetchInitialCode();
  }, []); 

  const handleRunCode = () => {
    onRunCode(code);
  };
      
	return (
		<div className="code-editor-container">
		<div className="code-editor-header">
		<div className="blue-bug"></div>
      <button className="code-editor-run-button" onClick={handleRunCode}>Run</button>
      <label htmlFor="theme-select">Select Theme:</label>
      <select id="theme-select" className="code-editor-theme-select" value={theme} onChange={handleThemeChange}>
          <option value="monokai">Monokai</option>
          <option value="ambiance">Ambiance</option>
          <option value="chaos">Chaos</option>
          <option value="dracula">Dracula</option>
          <option value="github">GitHub</option>
          <option value="tomorrow">Tomorrow</option>
          <option value="kuroir">Kuroir</option>
          <option value="twilight">Twilight</option>
          <option value="xcode">Xcode</option>
          <option value="solarized_dark">Solarized Dark</option>
          <option value="solarized_light">Solarized Light</option>
          <option value="terminal">Terminal</option>
          <option value="clouds_midnight">Clouds</option>
        </select>
        </div>
			<AceEditor 
        className="code-editor"
        mode={languageMode}
        theme={theme}
        name="code-editor"
        editorProps={{ $blockScrolling: true}}
        fontSize ={14}
        width="100%"
        height="100%"
        setOptions={{
          fontFamily: 'monospace',
          wrap: true,
        }}
        value={code}
        onChange={setCode}
      />
		</div>
	);
};

export default CodeEditor;

