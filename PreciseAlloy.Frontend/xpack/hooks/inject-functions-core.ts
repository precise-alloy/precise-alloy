import fs from 'fs';
import path from 'path';

export const FUNCTIONS_PLACEHOLDER = '/* DO NOT REMOVE - AUTO-IMPORTS FUNCTIONS PLACEHOLDER */';

export const FUNCTIONS_SOURCE_PATH = path.resolve('xpack/scripts/functions.ts');

export interface InjectFunctionsDependencies {
  readFileSync: typeof fs.readFileSync;
}

export const defaultInjectFunctionsDependencies: InjectFunctionsDependencies = {
  readFileSync: fs.readFileSync,
};

export const containsFunctionsPlaceholder = (code: string): boolean => code.includes(FUNCTIONS_PLACEHOLDER);

export const loadFunctionsSource = (
  sourcePath: string = FUNCTIONS_SOURCE_PATH,
  dependencies: InjectFunctionsDependencies = defaultInjectFunctionsDependencies
): string => dependencies.readFileSync(sourcePath, 'utf8') as string;
