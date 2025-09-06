import chalk from 'chalk';
import inquirer from 'inquirer';
import { BrainfuckInterpreter } from './interpreter.js';
import ora from 'ora';

export class Exercises {
  constructor() {
    this.exercises = {
      beginner: [
        {
          title: 'Set Cell Value',
          description: 'Set the current cell to the value 10',
          tests: [
            { input: '', expectedMemory: [10] }
          ],
          hint: 'Use the + command 10 times',
          solution: '++++++++++'
        },
        {
          title: 'Clear Cell',
          description: 'Clear a cell that contains the value 5',
          setup: '+++++',
          tests: [
            { input: '', expectedMemory: [0] }
          ],
          hint: 'Use a loop with the - command',
          solution: '+++++[-]'
        },
        {
          title: 'Move Value',
          description: 'Move the value 3 from cell 0 to cell 1',
          setup: '+++',
          tests: [
            { input: '', expectedMemory: [0, 3] }
          ],
          hint: 'Decrement source while incrementing destination',
          solution: '+++[->+<]'
        },
        {
          title: 'Output Character',
          description: 'Output the letter "A" (ASCII 65)',
          tests: [
            { input: '', expectedOutput: 'A' }
          ],
          hint: 'Set cell to 65 then use the . command',
          solution: '++++++++[>++++++++<-]>+.'
        },
        {
          title: 'Simple Loop',
          description: 'Output "AAA" (three A\'s)',
          tests: [
            { input: '', expectedOutput: 'AAA' }
          ],
          hint: 'Set up the ASCII value, then use a counter loop',
          solution: '+++[>++++++++[>++++++++<-]>+.[-]<<-]'
        }
      ],
      intermediate: [
        {
          title: 'Add Two Cells',
          description: 'Add cell 0 (value 3) to cell 1 (value 5)',
          setup: '+++>+++++',
          tests: [
            { input: '', expectedMemory: [0, 8] }
          ],
          hint: 'Move back and add first cell to second',
          solution: '+++>+++++<[->+<]'
        },
        {
          title: 'Copy Value',
          description: 'Copy the value 4 from cell 0 to cell 1 (preserve original)',
          setup: '++++',
          tests: [
            { input: '', expectedMemory: [4, 4] }
          ],
          hint: 'Use a temporary cell to preserve the original',
          solution: '++++[->+>+<<]>>[-<<+>>]'
        },
        {
          title: 'Input Echo',
          description: 'Read a character and output it twice',
          tests: [
            { input: 'X', expectedOutput: 'XX' }
          ],
          hint: 'Read, output, output again',
          solution: ',..'
        },
        {
          title: 'Multiplication',
          description: 'Multiply 3 * 4 and store result in cell 2',
          setup: '+++>++++',
          tests: [
            { input: '', expectedMemory: [0, 0, 12] }
          ],
          hint: 'Use nested loops to add repeatedly',
          solution: '+++>++++[-<[->+>+<<]>>[-<<+>>]<]'
        },
        {
          title: 'Count to Five',
          description: 'Output the digits 1 through 5',
          tests: [
            { input: '', expectedOutput: '12345' }
          ],
          hint: 'Start at ASCII 48 (0) and increment',
          solution: '+++++[>++++++++++<-]>-[+.[-]]'
        }
      ],
      advanced: [
        {
          title: 'Reverse Input',
          description: 'Read three characters and output them in reverse order',
          tests: [
            { input: 'ABC', expectedOutput: 'CBA' }
          ],
          hint: 'Store in different cells, then output backwards',
          solution: ',>,>,<<.>.>.'
        },
        {
          title: 'Uppercase Converter',
          description: 'Convert lowercase \'a\' to uppercase \'A\'',
          tests: [
            { input: 'a', expectedOutput: 'A' }
          ],
          hint: 'Subtract 32 from the ASCII value',
          solution: ',----------[----------------------.,----------]'
        },
        {
          title: 'Number Comparison',
          description: 'Output ">" if first input is greater than second, "=" if equal, "<" if less',
          tests: [
            { input: String.fromCharCode(5, 3), expectedOutput: '>' },
            { input: String.fromCharCode(3, 3), expectedOutput: '=' },
            { input: String.fromCharCode(2, 5), expectedOutput: '<' }
          ],
          hint: 'Subtract both simultaneously and check which reaches zero first',
          solution: ',>,[-<->]<[>++++++[>++++++++<-]>.[-]]>[<++++++[>++++++++<-]>+.[-]]<[->+<]>[++++++[>+++++++++++<-]>.[-]]'
        },
        {
          title: 'Fibonacci Sequence',
          description: 'Output first 5 Fibonacci numbers as ASCII characters',
          tests: [
            { input: '', expectedOutput: String.fromCharCode(1, 1, 2, 3, 5) }
          ],
          hint: 'Keep two cells for previous numbers, add them for next',
          solution: '+.>+.[-<+>]<[->+>+<<].>>[-<<+>>]<<[->+>+<<].>>[-<<+>>]<<[->+>+<<].'
        },
        {
          title: 'Division',
          description: 'Divide 12 by 3 (store quotient in cell 2)',
          setup: '++++++++++++>+++',
          tests: [
            { input: '', expectedMemory: [0, 0, 4] }
          ],
          hint: 'Repeatedly subtract divisor and count',
          solution: '++++++++++++>+++<[->-[>+>>]>[+[-<+>]>+>>]<<<<<]>>'
        }
      ]
    };
  }

  async start(level) {
    if (!level) {
      const { selectedLevel } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedLevel',
          message: 'Choose difficulty level:',
          choices: [
            { name: chalk.green('Beginner'), value: 'beginner' },
            { name: chalk.yellow('Intermediate'), value: 'intermediate' },
            { name: chalk.red('Advanced'), value: 'advanced' }
          ]
        }
      ]);
      level = selectedLevel;
    }

    const exercises = this.exercises[level];
    if (!exercises) {
      console.log(chalk.red('Invalid level. Choose: beginner, intermediate, or advanced'));
      return;
    }

    console.clear();
    console.log(chalk.cyan.bold(`\n🏋️ Brainfuck Exercises - ${level.charAt(0).toUpperCase() + level.slice(1)} Level\n`));

    let score = 0;
    for (let i = 0; i < exercises.length; i++) {
      const exercise = exercises[i];
      console.log(chalk.yellow(`\nExercise ${i + 1}/${exercises.length}: ${exercise.title}`));
      console.log(chalk.white(exercise.description));
      
      if (exercise.setup) {
        console.log(chalk.gray(`Starting setup: ${exercise.setup}`));
      }

      const { solution } = await inquirer.prompt([
        {
          type: 'input',
          name: 'solution',
          message: 'Your solution:',
          validate: (input) => {
            if (!input.trim()) return 'Please enter a solution';
            return true;
          }
        }
      ]);

      const fullSolution = (exercise.setup || '') + solution;
      const passed = await this.testSolution(fullSolution, exercise.tests);

      if (passed) {
        console.log(chalk.green('✓ Correct! Well done!'));
        score++;
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
          console.log(chalk.yellow('Hint:'), exercise.hint);
          
          const { showSolution } = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'showSolution',
              message: 'Would you like to see the solution?',
              default: false
            }
          ]);

          if (showSolution) {
            console.log(chalk.green('Solution:'), exercise.solution);
          }
        }
      }

      if (i < exercises.length - 1) {
        const { continue: cont } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'continue',
            message: 'Continue to next exercise?',
            default: true
          }
        ]);

        if (!cont) break;
      }
    }

    console.log(chalk.cyan('\n' + '='.repeat(50)));
    console.log(chalk.cyan.bold('Exercise Session Complete!'));
    console.log(chalk.yellow(`Your score: ${score}/${exercises.length}`));
    
    if (score === exercises.length) {
      console.log(chalk.green.bold('🎉 Perfect score! Excellent work!'));
    } else if (score >= exercises.length * 0.7) {
      console.log(chalk.green('👍 Good job! Keep practicing!'));
    } else {
      console.log(chalk.yellow('📚 Keep learning! Practice makes perfect!'));
    }
  }

  async testSolution(code, tests) {
    const spinner = ora('Testing your solution...').start();
    
    for (const test of tests) {
      const interpreter = new BrainfuckInterpreter({ input: test.input || '' });
      const result = interpreter.execute(code);
      
      if (!result.success) {
        spinner.fail(`Execution error: ${result.error}`);
        return false;
      }

      if (test.expectedOutput !== undefined) {
        if (result.output !== test.expectedOutput) {
          spinner.fail(`Output mismatch. Expected: "${test.expectedOutput}", Got: "${result.output}"`);
          return false;
        }
      }

      if (test.expectedMemory !== undefined) {
        const actualMemory = interpreter.getMemorySnapshot(0, test.expectedMemory.length);
        if (JSON.stringify(actualMemory) !== JSON.stringify(test.expectedMemory)) {
          spinner.fail(`Memory mismatch. Expected: [${test.expectedMemory}], Got: [${actualMemory}]`);
          return false;
        }
      }
    }

    spinner.succeed('All tests passed!');
    return true;
  }

  generateRandomExercise(difficulty = 'beginner') {
    const templates = {
      beginner: [
        {
          type: 'setValue',
          generate: () => {
            const value = Math.floor(Math.random() * 20) + 1;
            return {
              title: `Set cell to ${value}`,
              description: `Set the current cell to the value ${value}`,
              tests: [{ input: '', expectedMemory: [value] }],
              hint: `Use ${value} plus signs`,
              solution: '+'.repeat(value)
            };
          }
        },
        {
          type: 'moveValue',
          generate: () => {
            const value = Math.floor(Math.random() * 10) + 1;
            const distance = Math.floor(Math.random() * 3) + 1;
            return {
              title: `Move ${value} right ${distance} cells`,
              description: `Move the value ${value} from cell 0 to cell ${distance}`,
              setup: '+'.repeat(value),
              tests: [{ input: '', expectedMemory: Array(distance).fill(0).concat([value]) }],
              hint: `Use a loop to move the value`,
              solution: '+'.repeat(value) + '[' + '-' + '>'.repeat(distance) + '+' + '<'.repeat(distance) + ']'
            };
          }
        }
      ],
      intermediate: [
        {
          type: 'multiply',
          generate: () => {
            const a = Math.floor(Math.random() * 5) + 2;
            const b = Math.floor(Math.random() * 5) + 2;
            return {
              title: `Multiply ${a} * ${b}`,
              description: `Calculate ${a} * ${b} and store in cell 1`,
              tests: [{ input: '', expectedMemory: [0, a * b] }],
              hint: `Use nested loops`,
              solution: '+'.repeat(a) + '[' + '->' + '+'.repeat(b) + '<]'
            };
          }
        }
      ]
    };

    const exerciseTypes = templates[difficulty];
    if (!exerciseTypes) return null;

    const randomType = exerciseTypes[Math.floor(Math.random() * exerciseTypes.length)];
    return randomType.generate();
  }
}