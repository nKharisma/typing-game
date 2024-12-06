import React, { useState, useEffect } from "react";
import getBackendUrl from "../utils/getBackendUrl";
import '../css/GameDescription.css'

interface CodeEditorProps {
	language: string;
  filename: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ language, filename }) => {
	const [description, setDescription] = useState('');

  const parseDataToHTML = (data: any) => {
    // Split the string by '\n' to get individual lines
    const lines = data.split("\n");

    // Map each line into a JSX element
    return lines.map((line: any, index: any) => {
      if (line.startsWith("Instructions")) {
        return (
          <>
            <br />
            <p key={index}>
              <strong>Instructions</strong>
              {line.replace("Instructions", "")}
            </p>
          </>
        );
      } else if (line.startsWith("Input")) {
        return (
          <>
            <br />
            <p key={index}>
              <strong>Input</strong>
              {line.replace("Input", "")}
            </p>
          </>
        );
      } else if (line.startsWith("Output")) {
        return (
          <>
            <br />
            <p key={index}>
              <strong>Output</strong>
              {line.replace("Output", "")}
            </p>
          </>
        );
      } else if (line.startsWith("Challenge Input")) {
        return (
          <>
            <br />
            <p key={index}>
              <strong>Challenge Input</strong>
              {line.replace("Challenge Input", "")}
            </p>
          </>
        );
      } else {
        return <p key={index}>{line}</p>;
      }
    });
  };

  const extension = language === "java" ? ".java" : language === "python" ? ".py" : ".js";
      
  useEffect(() => {
    const fetchDescription = async () => {
      try {
        const response = await fetch(`${getBackendUrl()}/api/v1/user/get-puzzle`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({filename: `${filename}${extension}`})
        });
        const data = await response.json();
        setDescription(data.getPuzzleResult.description); // Assume `data.code` contains the code from the API response
      } catch (error) {
        console.error("Failed to fetch initial code:", error);
      }
    };

    fetchDescription();
  }, []); // Empty dependency array ensures this runs once on mount

	return (
		<div className="game-description-text">
      {parseDataToHTML(description)}
		</div>
	);
};

export default CodeEditor;
