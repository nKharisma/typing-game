import React from "react";
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

interface CodeEditorProps {
	language: string;
	theme: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ language, theme }) => {
	const languageMode = language === "java" ? "java" : language === "python" ? "python" : "javascript";
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
	return (
		<AceEditor
			mode={languageMode}
			theme={editorTheme}
			name="code-editor"
			editorProps={{ $blockScrolling: true}}
			fontSize ={16}
			width="100%"
			height="300px"
			setOptions={{
				fontFamily: 'monospace',
			}}
		/>
	);
};

export default CodeEditor;

