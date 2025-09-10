export type Example = {
	id: number;
	inputText: string;
	outputText: string;
	explanation?: string;
};

export type Puzzle = {
	id: string;
	puzzleDescription: string;
	examples: Example[];
	order: number;
	handlerFunction: ((fn: any) => boolean) | string;
	starterFunctionName: string;
};

export type DBPuzzle = {
	_id: string;
	language: string;
	code: string;
	description: string;
	filename: string;
	__v: number;
};