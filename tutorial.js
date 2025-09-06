import chalk from 'chalk';
import inquirer from 'inquirer';
import { BrainfuckInterpreter } from './interpreter.js';
import ora from 'ora';

export class Tutorial {
  constructor() {
    this.lessons = [
      {
        title: 'Introduction to Brainfuck',
        content: `
Brainfuck is a minimalist programming language created by Urban Müller in 1993.
It consists of only 8 commands, yet it is Turing-complete!

The language operates on:
- A memory array of at least 30,000 cells (initialized to 0)
- A data pointer (starting at the leftmost cell)
- An instruction pointer
- Input and output streams

Despite its simplicity, Brainfuck can perform any computation that other 
programming languages can (theoretically).`,
        practice: null
      },
      {
        title: 'The Eight Commands',
        content: `
The eight Brainfuck commands are:

${chalk.green('>')}  Move pointer right (increment data pointer)
${chalk.green('<')}  Move pointer left (decrement data pointer)
${chalk.green('+')}  Increment value at current cell
${chalk.green('-')}  Decrement value at current cell
${chalk.green('.')}  Output ASCII character of current cell
${chalk.green(',')}  Input a byte and store in current cell
${chalk.green('[')}  Jump forward to ] if current cell is 0
${chalk.green(']')}  Jump back to [ if current cell is not 0

All other characters are treated as comments.`,
        practice: {
          task: 'Write a program that sets the first cell to 5',
          solution: '+++++',
          hint: 'Use the + command five times'
        }
      },
      {
        title: 'Memory and Pointer Movement',
        content: `
Brainfuck uses a linear memory model:

[0][0][0][0][0][0][0]...
 ^
pointer

Commands ${chalk.green('>')} and ${chalk.green('<')} move the pointer:
- ${chalk.green('>')} moves right (to next cell)
- ${chalk.green('<')} moves left (to previous cell)

Example: >+>++ sets cells to [0][1][2]...
         Starting at cell 0, move right, add 1, move right, add 2`,
        practice: {
          task: 'Set first three cells to 1, 2, 3',
          solution: '+>++>+++',
          hint: 'Add values then move right with >'
        }
      },
      {
        title: 'Input and Output',
        content: `
I/O commands work with ASCII values:

${chalk.green(',')} - Reads one byte from input
${chalk.green('.')} - Outputs ASCII character of current cell value

Example: To output 'A' (ASCII 65):
${'A' generation process:
Initialize cell to 65, then output

Code: ${chalk.yellow('++++++++[>++++++++<-]>+.')}
This uses a loop to efficiently reach 65 (8*8+1)`,
        practice: {
          task: 'Output the letter "H" (ASCII 72)',
          solution: '+++++++++[>++++++++<-]>.',
          hint: 'Try 9*8=72, use a loop for efficiency'
        }
      },
      {
        title: 'Loops',
        content: `
Loops in Brainfuck use ${chalk.green('[')} and ${chalk.green(']')}:

${chalk.green('[')} - If current cell is 0, jump to matching ]
${chalk.green(']')} - If current cell is NOT 0, jump back to matching [

Simple loop to clear a cell: ${chalk.yellow('[-]')}
This decrements the cell until it reaches 0

Loop to move value: ${chalk.yellow('[->+<]')}
Moves value from current cell to next cell`,
        practice: {
          task: 'Write a program to clear any cell (set to 0)',
          solution: '[-]',
          hint: 'Keep decrementing until zero'
        }
      },
      {
        title: 'Your First Real Program: Cat',
        content: `
The "cat" program echoes input back to output:

${chalk.yellow(',[.,]')}

How it works:
1. ${chalk.green(',')} - Read first character
2. ${chalk.green('[')} - Start loop (if not null)
3. ${chalk.green('.')} - Output the character
4. ${chalk.green(',')} - Read next character
5. ${chalk.green(']')} - Loop back if not null

This continues until a null character (0) is input.`,
        practice: {
          task: 'Write the cat program',
          solution: ',[.,]',
          hint: 'Read, loop while outputting and reading'
        }
      },
      {
        title: 'Moving and Copying Values',
        content: `
Common patterns for manipulating values:

Move value right: ${chalk.yellow('[->+<]')}
- Decrement source, increment destination

Copy value: ${chalk.yellow('[->+>+<<]>>[-<<+>>]')}
- Uses temporary cell to preserve original

Add two cells: ${chalk.yellow('[-<+>]')}
- Adds current cell to previous cell`,
        practice: {
          task: 'Move value two cells to the right',
          solution: '[->>+<<]',
          hint: 'Similar to [->+<] but move two cells'
        }
      },
      {
        title: 'Hello World Explained',
        content: `
The famous Hello World program uses optimization:

${chalk.yellow('++++++++++[>+++++++>++++++++++>+++>+<<<<-]')}

This loop sets up base values:
- Cell 1: 70 (close to 'H'=72)
- Cell 2: 100 (close to 'e'=101)
- Cell 3: 30 (for space=32)
- Cell 4: 10 (newline)

Then adjusts and outputs each character:
${chalk.yellow('>++.')} outputs 'H' (70+2=72)
${chalk.yellow('>+.')} outputs 'e' (100+1=101)
And so on...`,
        practice: {
          task: 'Output "Hi" using the loop technique',
          solution: '+++++++++[>++++++++>++++++++<<-]>.',
          hint: 'Set up base value with loop, then adjust'
        }
      },
      {
        title: 'Conditional Execution (If-Then)',
        content: `
Brainfuck doesn't have explicit if statements, but we can simulate them:

If x != 0: ${chalk.yellow('>[-]<[>+<[-]]>')}
- Uses temporary cell as flag

If x == 0: ${chalk.yellow('>[-]+<[>-<]>[code[-]]')}
- Sets flag, clears if x != 0

These patterns let you execute code conditionally.`,
        practice: {
          task: 'Create an if-not-zero that prints "1"',
          solution: '+[>+++++++[>+++++++++<-]>.[-]]',
          hint: 'Check if cell is not zero, then output ASCII 49'
        }
      },
      {
        title: 'Advanced Techniques',
        content: `
Advanced Brainfuck techniques:

1. ${chalk.cyan('Number representation')}: Store digits separately
2. ${chalk.cyan('Multiplication')}: Nested loops for repeated addition
3. ${chalk.cyan('Division')}: Repeated subtraction with counter
4. ${chalk.cyan('Comparison')}: Simultaneous decrement until one reaches 0
5. ${chalk.cyan('Arrays')}: Use pointer position as index

Example - Multiply 3*5:
${chalk.yellow('+++[->+++++<]>')}
Adds 5 to next cell, 3 times = 15`,
        practice: {
          task: 'Multiply 4*3 using loops',
          solution: '++++[->+++<]>',
          hint: 'Add 3 to next cell, 4 times'
        }
      }
    ];

    this.currentLesson = 0;
  }

  async start() {
    console.clear();
    console.log(chalk.cyan.bold('\n🧠 Welcome to the Brainfuck Interactive Tutorial!\n'));
    console.log(chalk.gray('This tutorial will teach you Brainfuck step by step.\n'));

    await this.showMenu();
  }

  async showMenu() {
    const choices = [
      { name: chalk.green('Start from beginning'), value: 'start' },
      { name: chalk.yellow('Choose a lesson'), value: 'choose' },
      { name: chalk.cyan('Quick reference'), value: 'reference' },
      { name: chalk.gray('Exit tutorial'), value: 'exit' }
    ];

    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices
      }
    ]);

    switch (action) {
      case 'start':
        this.currentLesson = 0;
        await this.runLesson();
        break;
      case 'choose':
        await this.chooseLesson();
        break;
      case 'reference':
        await this.showReference();
        break;
      case 'exit':
        console.log(chalk.cyan('Thanks for learning Brainfuck!'));
        return;
    }
  }

  async chooseLesson() {
    const { lesson } = await inquirer.prompt([
      {
        type: 'list',
        name: 'lesson',
        message: 'Choose a lesson:',
        choices: this.lessons.map((l, i) => ({
          name: `${i + 1}. ${l.title}`,
          value: i
        }))
      }
    ]);

    this.currentLesson = lesson;
    await this.runLesson();
  }

  async runLesson() {
    const lesson = this.lessons[this.currentLesson];
    
    console.clear();
    console.log(chalk.cyan.bold(`\nLesson ${this.currentLesson + 1}: ${lesson.title}`));
    console.log(chalk.cyan('='.repeat(50)));
    console.log(lesson.content);

    if (lesson.practice) {
      console.log(chalk.yellow('\n📝 Practice Exercise:'));
      console.log(chalk.white(lesson.practice.task));
      
      const { attempt } = await inquirer.prompt([
        {
          type: 'input',
          name: 'attempt',
          message: 'Your solution:',
          validate: (input) => {
            if (!input.trim()) return 'Please enter a solution';
            return true;
          }
        }
      ]);

      await this.checkSolution(attempt, lesson.practice);
    }

    const { next } = await inquirer.prompt([
      {
        type: 'list',
        name: 'next',
        message: 'What next?',
        choices: [
          { name: 'Continue to next lesson', value: 'next' },
          { name: 'Retry this lesson', value: 'retry' },
          { name: 'Back to menu', value: 'menu' }
        ]
      }
    ]);

    if (next === 'next') {
      if (this.currentLesson < this.lessons.length - 1) {
        this.currentLesson++;
        await this.runLesson();
      } else {
        console.log(chalk.green.bold('\n🎉 Congratulations! You\'ve completed the tutorial!'));
        await inquirer.prompt([
          {
            type: 'input',
            name: 'continue',
            message: 'Press Enter to return to menu...'
          }
        ]);
        await this.showMenu();
      }
    } else if (next === 'retry') {
      await this.runLesson();
    } else {
      await this.showMenu();
    }
  }

  async checkSolution(attempt, practice) {
    const spinner = ora('Testing your solution...').start();
    
    const interpreter = new BrainfuckInterpreter();
    const result = interpreter.execute(attempt);
    
    spinner.stop();

    const isCorrect = this.verifySolution(attempt, practice.solution);

    if (isCorrect) {
      console.log(chalk.green('✓ Correct! Well done!'));
      if (result.output) {
        console.log(chalk.gray('Output: ' + result.output));
      }
    } else {
      console.log(chalk.red('✗ Not quite right.'));
      
      const { showHint } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'showHint',
          message: 'Would you like a hint?',
          default: true
        }
      ]);

      if (showHint) {
        console.log(chalk.yellow('Hint: ' + practice.hint));
        
        const { showSolution } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'showSolution',
            message: 'Would you like to see the solution?',
            default: false
          }
        ]);

        if (showSolution) {
          console.log(chalk.green('Solution: ' + practice.solution));
          
          const solutionResult = interpreter.execute(practice.solution);
          if (solutionResult.output) {
            console.log(chalk.gray('Output: ' + solutionResult.output));
          }
        }
      }
    }
  }

  verifySolution(attempt, solution) {
    const cleanAttempt = attempt.replace(/[^><+\-.,[\]]/g, '');
    const cleanSolution = solution.replace(/[^><+\-.,[\]]/g, '');
    
    const interpreter1 = new BrainfuckInterpreter();
    const interpreter2 = new BrainfuckInterpreter();
    
    const result1 = interpreter1.execute(cleanAttempt);
    const result2 = interpreter2.execute(cleanSolution);
    
    if (!result1.success || !result2.success) return false;
    
    if (result1.output !== result2.output) return false;
    
    const memory1 = interpreter1.getMemorySnapshot(0, 10);
    const memory2 = interpreter2.getMemorySnapshot(0, 10);
    
    return JSON.stringify(memory1) === JSON.stringify(memory2);
  }

  async showReference() {
    console.clear();
    console.log(chalk.cyan.bold('\n🧠 Brainfuck Quick Reference\n'));
    
    console.log(chalk.yellow('Commands:'));
    console.log('  > : Move pointer right');
    console.log('  < : Move pointer left');
    console.log('  + : Increment current cell');
    console.log('  - : Decrement current cell');
    console.log('  . : Output ASCII character');
    console.log('  , : Input one byte');
    console.log('  [ : Jump to ] if cell is 0');
    console.log('  ] : Jump to [ if cell is not 0');
    
    console.log(chalk.yellow('\nCommon Patterns:'));
    console.log('  [-]        : Clear cell');
    console.log('  [->+<]     : Move value right');
    console.log('  [->+>+<<]  : Copy value');
    console.log('  ,[.,]      : Cat program');
    console.log('  [>]        : Find next zero');
    
    console.log(chalk.yellow('\nTips:'));
    console.log('  • Use loops for efficient value setting');
    console.log('  • Remember ASCII values (A=65, a=97, 0=48)');
    console.log('  • Comments are any non-command characters');
    console.log('  • Memory wraps at 256 (byte overflow)');
    
    await inquirer.prompt([
      {
        type: 'input',
        name: 'continue',
        message: 'Press Enter to continue...'
      }
    ]);
    
    await this.showMenu();
  }
}