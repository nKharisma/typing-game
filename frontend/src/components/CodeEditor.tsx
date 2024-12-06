import React, { useState, useEffect } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/theme-kuroir";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/theme-solarized_dark";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/theme-terminal";
import getBackendUrl from "../utils/getBackendUrl";

interface CodeEditorProps {
	language: string;
	theme: string;
  filename: string;
	onRunCode: (code: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ language, theme, filename, onRunCode }) => {
	const [code, setCode] = useState('');

	const languageMode = language === "java" ? "java" : language === "python" ? "python" : "javascript";
  const extension = language === "java" ? ".java" : language === "python" ? ".py" : ".js";
	const editorTheme =
    theme === 'monokai'
      ? 'monokai'
      : theme === 'github'
      ? 'github'
      : theme === 'tomorrow'
      ? 'tomorrow'
      : theme === 'kuroir'
      ? 'kuroir'
      : theme === 'twilight'
      ? 'twilight'
      : theme === 'xcode'
      ? 'xcode'
      : theme === 'solarized dark'
      ? 'solarized_dark'
      : theme === 'solarized light'
      ? 'solarized_light'
      : 'terminal';
      
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
  }, []); // Empty dependency array ensures this runs once on mount

  const handleRunCode = () => {
    onRunCode(code);
  };
      
	return (
		<div>
			<AceEditor className="code-editor-container"
			mode={languageMode}
			theme={editorTheme}
			name="code-editor"
			editorProps={{ $blockScrolling: true}}
			fontSize ={14}
			width="100%"
			setOptions={{
				fontFamily: 'monospace',
			}}
			value={code}
			onChange={setCode}
		/>
		<button className="button-container" onClick={handleRunCode}>Run</button>
		</div>
	);
};

export default CodeEditor;

