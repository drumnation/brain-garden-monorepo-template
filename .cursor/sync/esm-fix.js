import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// ESM equivalent of __dirname
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

// Export for use in other files
export const ROOT_DIR = join(__dirname, '..', '..');