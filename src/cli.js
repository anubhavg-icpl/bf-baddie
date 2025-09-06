#!/usr/bin/env node

import { Command } from 'commander';
import { BrainfuckInterpreter } from './interpreter.js';
import { Tutorial } from './tutorial.js';
import { Examples } from './examples.js';
import { Visualizer } from './visualizer.js';
import { Exercises } from './exercises.js';
import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

program
  .name('bf')
  .description('Interactive Brainfuck learning CLI')
  .version('1.0.0');

program
  .command('run <file>')
  .description('Run a Brainfuck program from file')
  .option('-i, --input <input>', 'Input string for the program')
  .option('-d, --debug', 'Enable debug mode')
  .option('-v, --visualize', 'Show memory visualization')
  .action(async (file, options) => {
    try {
      const code = await fs.readFile(file, 'utf-8');
      const interpreter = new BrainfuckInterpreter({
        input: options.input || '',
        debug: options.debug
      });
      
      const spinner = ora('Running Brainfuck program...').start();
      const result = interpreter.execute(code);
      spinner.stop();
      
      if (result.success) {
        console.log(chalk.green('✓ Program executed successfully'));
        console.log(chalk.yellow('Output:'), result.output);
        
        if (options.debug) {
          console.log(chalk.cyan('Iterations:'), result.iterations);
          console.log(chalk.cyan('Final memory (first 20 cells):'));
          console.log(result.finalMemory.slice(0, 20));
        }
        
        if (options.visualize) {
          const visualizer = new Visualizer();
          visualizer.display(result.finalMemory);
        }
      } else {
        console.log(chalk.red('✗ Error:'), result.error);
        if (result.output) {
          console.log(chalk.yellow('Partial output:'), result.output);
        }
      }
    } catch (error) {
      console.log(chalk.red('✗ Error:'), error.message);
    }
  });

program
  .command('exec <code>')
  .description('Execute Brainfuck code directly')
  .option('-i, --input <input>', 'Input string for the program')
  .option('-d, --debug', 'Enable debug mode')
  .action((code, options) => {
    const interpreter = new BrainfuckInterpreter({
      input: options.input || '',
      debug: options.debug
    });
    
    const result = interpreter.execute(code);
    
    if (result.success) {
      console.log(chalk.green('✓ Program executed successfully'));
      console.log(chalk.yellow('Output:'), result.output);
      
      if (options.debug) {
        console.log(chalk.cyan('Iterations:'), result.iterations);
        console.log(chalk.cyan('Final memory (first 20 cells):'));
        console.log(result.finalMemory.slice(0, 20));
      }
    } else {
      console.log(chalk.red('✗ Error:'), result.error);
      if (result.output) {
        console.log(chalk.yellow('Partial output:'), result.output);
      }
    }
  });

program
  .command('tutorial')
  .description('Start interactive Brainfuck tutorial')
  .action(async () => {
    const tutorial = new Tutorial();
    await tutorial.start();
  });

program
  .command('examples')
  .description('Browse and run example programs')
  .action(async () => {
    const examples = new Examples();
    await examples.browse();
  });

program
  .command('exercise [level]')
  .description('Practice with exercises (beginner/intermediate/advanced)')
  .action(async (level) => {
    const exercises = new Exercises();
    await exercises.start(level);
  });

program
  .command('debug <file>')
  .description('Debug a Brainfuck program step by step')
  .option('-i, --input <input>', 'Input string for the program')
  .action(async (file, options) => {
    try {
      const code = await fs.readFile(file, 'utf-8');
      const interpreter = new BrainfuckInterpreter({
        input: options.input || '',
        debug: true
      });
      
      console.log(chalk.cyan('Starting debugger... Use commands: n (next), m (memory), q (quit)'));
      
      let step = 0;
      const cleanCode = code.replace(/[^><+\-.,[\]]/g, '');
      
      while (true) {
        const stepResult = interpreter.step(code);
        
        if (stepResult.done) {
          console.log(chalk.green('Program finished'));
          console.log(chalk.yellow('Output:'), interpreter.output);
          break;
        }
        
        const state = stepResult.state;
        console.log(chalk.gray(`Step ${step++}: ${state.instruction} at position ${state.instructionPointer}`));
        console.log(chalk.gray(`Memory[${state.pointer}] = ${state.value}`));
        
        const { command } = await inquirer.prompt([
          {
            type: 'input',
            name: 'command',
            message: '>',
            default: 'n'
          }
        ]);
        
        if (command === 'q') {
          console.log(chalk.yellow('Debugging stopped'));
          break;
        } else if (command === 'm') {
          console.log(chalk.cyan('Memory snapshot:'));
          console.log(interpreter.getMemorySnapshot(0, 30));
        }
      }
    } catch (error) {
      console.log(chalk.red('✗ Error:'), error.message);
    }
  });

program
  .command('generate <text>')
  .description('Generate Brainfuck code that outputs the given text')
  .action((text) => {
    const code = generateBrainfuckCode(text);
    console.log(chalk.green('Generated Brainfuck code:'));
    console.log(code);
    console.log(chalk.gray('\nOptimized version:'));
    console.log(optimizeBrainfuckCode(code));
  });

program
  .command('visualize <code>')
  .description('Visualize Brainfuck code execution')
  .option('-i, --input <input>', 'Input string for the program')
  .option('-s, --speed <speed>', 'Animation speed (ms)', '100')
  .action(async (code, options) => {
    const visualizer = new Visualizer();
    await visualizer.animate(code, {
      input: options.input || '',
      speed: parseInt(options.speed)
    });
  });

function generateBrainfuckCode(text) {
  let code = '';
  let currentValue = 0;
  
  for (const char of text) {
    const targetValue = char.charCodeAt(0);
    const diff = targetValue - currentValue;
    
    if (diff > 0) {
      code += '+'.repeat(diff);
    } else if (diff < 0) {
      code += '-'.repeat(-diff);
    }
    
    code += '.';
    currentValue = targetValue;
  }
  
  return code;
}

function optimizeBrainfuckCode(code) {
  let optimized = '';
  let currentValue = 0;
  
  const setupLoop = '++++++++++[>+++++++>++++++++++>+++>+<<<<-]>';
  const baseValues = [0, 70, 100, 30, 10];
  
  optimized += setupLoop;
  currentValue = baseValues[1];
  let position = 1;
  
  for (const char of code) {
    if (char === '.') {
      const targetValue = code.charCodeAt(code.indexOf(char));
      const diff = targetValue - currentValue;
      
      if (Math.abs(diff) > 20) {
        const nearestBase = baseValues.reduce((prev, curr, idx) => {
          if (Math.abs(curr - targetValue) < Math.abs(baseValues[prev] - targetValue)) {
            return idx;
          }
          return prev;
        }, position);
        
        const moves = nearestBase - position;
        if (moves > 0) {
          optimized += '>'.repeat(moves);
        } else if (moves < 0) {
          optimized += '<'.repeat(-moves);
        }
        
        position = nearestBase;
        currentValue = baseValues[nearestBase];
      }
      
      const adjustDiff = targetValue - currentValue;
      if (adjustDiff > 0) {
        optimized += '+'.repeat(adjustDiff);
      } else if (adjustDiff < 0) {
        optimized += '-'.repeat(-adjustDiff);
      }
      
      optimized += '.';
      currentValue = targetValue;
    }
  }
  
  return optimized;
}

program.parse(process.argv);