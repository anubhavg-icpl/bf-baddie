import chalk from 'chalk';
import { BrainfuckInterpreter } from './interpreter.js';

export class Visualizer {
  constructor() {
    this.cellWidth = 5;
    this.visibleCells = 20;
  }

  display(memory, pointer = 0, start = 0) {
    const end = start + this.visibleCells;
    
    console.log(chalk.cyan('\nMemory Visualization:'));
    console.log(chalk.gray('─'.repeat(this.visibleCells * (this.cellWidth + 1) + 1)));
    
    let topRow = '│';
    let middleRow = '│';
    let bottomRow = '│';
    let pointerRow = ' ';
    
    for (let i = start; i < end; i++) {
      const value = memory[i] || 0;
      const cellStr = value.toString().padStart(this.cellWidth - 1);
      const cellColor = value === 0 ? chalk.gray : chalk.white;
      
      topRow += cellColor(cellStr) + '│';
      
      const ascii = (value >= 32 && value <= 126) ? String.fromCharCode(value) : '.';
      const asciiStr = ascii.padStart(this.cellWidth - 1);
      middleRow += chalk.yellow(asciiStr) + '│';
      
      const indexStr = i.toString().padStart(this.cellWidth - 1);
      bottomRow += chalk.dim(indexStr) + '│';
      
      if (i === pointer) {
        pointerRow += ' '.repeat(Math.floor(this.cellWidth / 2)) + chalk.green('▲') + ' '.repeat(Math.ceil(this.cellWidth / 2));
      } else {
        pointerRow += ' '.repeat(this.cellWidth + 1);
      }
    }
    
    console.log(topRow);
    console.log(chalk.gray('├' + '─'.repeat(this.visibleCells * (this.cellWidth + 1) - 1) + '┤'));
    console.log(middleRow);
    console.log(chalk.gray('├' + '─'.repeat(this.visibleCells * (this.cellWidth + 1) - 1) + '┤'));
    console.log(bottomRow);
    console.log(chalk.gray('─'.repeat(this.visibleCells * (this.cellWidth + 1) + 1)));
    console.log(pointerRow);
    
    const nonZeroCells = memory.filter(v => v !== 0).length;
    console.log(chalk.gray(`\nNon-zero cells: ${nonZeroCells}`));
    console.log(chalk.gray(`Pointer position: ${pointer}`));
  }

  async animate(code, options = {}) {
    const interpreter = new BrainfuckInterpreter({
      input: options.input || '',
      stepCallback: (state) => {
        this.renderFrame(state, code, options.speed || 100);
      }
    });

    console.clear();
    console.log(chalk.cyan.bold('Brainfuck Execution Visualizer\n'));
    
    const result = interpreter.execute(code);
    
    if (result.success) {
      console.log(chalk.green('\n✓ Program completed successfully'));
      if (result.output) {
        console.log(chalk.yellow('Final output:'), result.output);
      }
    } else {
      console.log(chalk.red('\n✗ Error:'), result.error);
    }
  }

  renderFrame(state, code, speed) {
    if (speed > 0) {
      const start = Math.max(0, state.pointer - 10);
      
      console.clear();
      console.log(chalk.cyan.bold('Brainfuck Execution Visualizer\n'));
      
      this.displayCode(code, state.instructionPointer);
      
      console.log(chalk.yellow('\nCurrent instruction:'), chalk.green(state.instruction));
      console.log(chalk.gray(`Position: ${state.instructionPointer}`));
      
      this.display(state.memory, state.pointer, start);
      
      if (state.output) {
        console.log(chalk.yellow('\nOutput so far:'), state.output);
      }
      
      this.sleep(speed);
    }
  }

  displayCode(code, position) {
    const cleanCode = code.replace(/[^><+\-.,[\]]/g, '');
    const windowSize = 60;
    const start = Math.max(0, position - 30);
    const end = Math.min(cleanCode.length, start + windowSize);
    
    console.log(chalk.cyan('Code:'));
    
    let displayCode = '';
    for (let i = start; i < end; i++) {
      if (i === position) {
        displayCode += chalk.bgGreen.black(cleanCode[i]);
      } else {
        displayCode += chalk.gray(cleanCode[i]);
      }
    }
    
    if (start > 0) displayCode = '...' + displayCode;
    if (end < cleanCode.length) displayCode += '...';
    
    console.log(displayCode);
  }

  sleep(ms) {
    const start = Date.now();
    while (Date.now() - start < ms) {}
  }

  createMemoryMap(memory, width = 80, height = 10) {
    const map = [];
    const cellsPerRow = Math.floor(width / 4);
    
    for (let row = 0; row < height; row++) {
      let line = '';
      for (let col = 0; col < cellsPerRow; col++) {
        const index = row * cellsPerRow + col;
        if (index < memory.length) {
          const value = memory[index];
          if (value === 0) {
            line += chalk.gray('░░░');
          } else if (value < 32) {
            line += chalk.blue('▒▒▒');
          } else if (value < 128) {
            line += chalk.green('▓▓▓');
          } else {
            line += chalk.red('███');
          }
          line += ' ';
        }
      }
      map.push(line);
    }
    
    return map;
  }

  displayMemoryMap(memory) {
    console.log(chalk.cyan('\nMemory Heat Map:'));
    console.log(chalk.gray('(Gray=0, Blue=Control, Green=ASCII, Red=Extended)'));
    
    const map = this.createMemoryMap(memory);
    map.forEach(line => console.log(line));
  }

  displayExecutionStats(history) {
    const commandCounts = {};
    const cellAccess = {};
    
    history.forEach(step => {
      commandCounts[step.instruction] = (commandCounts[step.instruction] || 0) + 1;
      cellAccess[step.pointer] = (cellAccess[step.pointer] || 0) + 1;
    });
    
    console.log(chalk.cyan('\nExecution Statistics:'));
    console.log(chalk.yellow('Command usage:'));
    Object.entries(commandCounts).forEach(([cmd, count]) => {
      const bar = '█'.repeat(Math.min(50, Math.floor(count / 10)));
      console.log(`  ${cmd}: ${count.toString().padStart(6)} ${chalk.green(bar)}`);
    });
    
    console.log(chalk.yellow('\nMost accessed cells:'));
    const topCells = Object.entries(cellAccess)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    topCells.forEach(([cell, count]) => {
      const bar = '█'.repeat(Math.min(50, Math.floor(count / 10)));
      console.log(`  Cell ${cell.padStart(3)}: ${count.toString().padStart(6)} ${chalk.blue(bar)}`);
    });
    
    console.log(chalk.gray(`\nTotal steps: ${history.length}`));
    console.log(chalk.gray(`Unique cells accessed: ${Object.keys(cellAccess).length}`));
  }

  displayFlowChart(code) {
    const cleanCode = code.replace(/[^><+\-.,[\]]/g, '');
    const loops = [];
    const stack = [];
    
    for (let i = 0; i < cleanCode.length; i++) {
      if (cleanCode[i] === '[') {
        stack.push(i);
      } else if (cleanCode[i] === ']') {
        if (stack.length > 0) {
          const start = stack.pop();
          loops.push({ start, end: i, depth: stack.length });
        }
      }
    }
    
    console.log(chalk.cyan('\nLoop Structure:'));
    
    if (loops.length === 0) {
      console.log(chalk.gray('No loops found'));
      return;
    }
    
    loops.forEach((loop, index) => {
      const indent = '  '.repeat(loop.depth);
      const loopCode = cleanCode.slice(loop.start, loop.end + 1);
      const preview = loopCode.length > 40 ? loopCode.slice(0, 37) + '...' : loopCode;
      
      console.log(`${indent}Loop ${index + 1}: [${loop.start}-${loop.end}]`);
      console.log(`${indent}  ${chalk.gray(preview)}`);
      
      const innerOps = this.analyzeLoop(loopCode);
      if (innerOps.netPointerChange === 0 && innerOps.decrements > 0) {
        console.log(`${indent}  ${chalk.green('✓ Balanced loop (likely terminates)')}`);
      } else if (innerOps.netPointerChange !== 0) {
        console.log(`${indent}  ${chalk.yellow('⚠ Pointer moves')} (${innerOps.netPointerChange > 0 ? '+' : ''}${innerOps.netPointerChange})`);
      } else if (innerOps.decrements === 0) {
        console.log(`${indent}  ${chalk.red('✗ Potential infinite loop')}`);
      }
    });
  }

  analyzeLoop(loopCode) {
    let netPointerChange = 0;
    let increments = 0;
    let decrements = 0;
    
    for (const char of loopCode) {
      switch (char) {
        case '>': netPointerChange++; break;
        case '<': netPointerChange--; break;
        case '+': increments++; break;
        case '-': decrements++; break;
      }
    }
    
    return { netPointerChange, increments, decrements };
  }
}