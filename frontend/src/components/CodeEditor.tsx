import React, {useState} from "react";
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
	onRunCode: (code: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ language, theme }) => {
	const [code, setCode] = useState('');

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
      
      const handleRunCode = () => {
       // onRunCode(code);
      };
      
	return (
		<div>
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
			value={code}
			onChange={setCode}
		/>
		<button onClick={handleRunCode}>Run</button>
		</div>
	);
};

export default CodeEditor;

