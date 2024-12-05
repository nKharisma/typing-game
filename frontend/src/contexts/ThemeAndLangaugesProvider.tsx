import React, {createContext, useContext, useState, ReactNode} from 'react';

interface ThemeAndLanguagesContextType {
	theme: string;
	setTheme: (theme: string) => void;
	language: string;
	setLanguage: (language: string) => void;
}

const ThemeAndLanguagesContext = createContext<ThemeAndLanguagesContextType | undefined>(undefined);

export const ThemeAndLanguagesProvider: React.FC<{ children: ReactNode }> = ({ children}) => {
	const [theme, setTheme] = useState<string>('monokai');
	const [language, setLanguage] = useState<string>('javascript');
	
	return (
		<ThemeAndLanguagesContext.Provider value={{theme, setTheme, language, setLanguage }}>
			{children}
		</ThemeAndLanguagesContext.Provider>
		);
	};

export const useThemeAndLanguages = () => {
	const context = useContext(ThemeAndLanguagesContext);
	if(!context) {
		throw new Error('useThemeAndLanguages must be used within a ThemeAndLanguagesProvider');
	}
	return context;
};
