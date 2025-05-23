import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load all .graphql files in the schemas directory
const typesArray = loadFilesSync(path.join(__dirname, './schemas'), {
  extensions: ['graphql'],
});

// Merge them into a single schema
export const graphQLSchema = mergeTypeDefs(typesArray);

