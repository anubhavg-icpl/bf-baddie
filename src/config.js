import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const config = {
  paths: {
    root: path.resolve(__dirname, '..'),
    data: path.resolve(__dirname, '..', 'data'),
    examples: path.resolve(__dirname, '..', 'data', 'examples'),
    exercises: path.resolve(__dirname, '..', 'data', 'exercises')
  },
  interpreter: {
    memorySize: 30000,
    maxIterations: 1000000
  },
  visualizer: {
    cellWidth: 5,
    visibleCells: 20,
    animationSpeed: 100
  },
  colors: {
    success: '#00ff00',
    error: '#ff0000',
    warning: '#ffff00',
    info: '#00ffff',
    debug: '#808080'
  }
};