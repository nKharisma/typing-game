import React, { useState, useEffect } from "react";
import getBackendUrl from "../utils/getBackendUrl";

interface CodeEditorProps {
	language: string;
  filename: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ language, filename }) => {
	const [description, setDescription] = useState('');

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
		<div>
      <p>{description}</p>
		</div>
	);
};

export default CodeEditor;
