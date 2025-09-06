import chalk from 'chalk';
import inquirer from 'inquirer';
import { BrainfuckInterpreter } from './interpreter.js';

export class Examples {
  constructor() {
    this.examples = {
      basic: {
        'Hello World': {
          code: '++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.>.',
          description: 'Classic Hello World program',
          explanation: 'Uses a loop to initialize memory cells efficiently, then outputs characters'
        },
        'Cat (Echo)': {
          code: ',[.,]',
          description: 'Echoes input until null character',
          explanation: 'Reads input, enters loop, outputs character, reads next input'
        },
        'Cat Alt': {
          code: ',+[-.,+]',
          description: 'Echo program that exits on 255',
          explanation: 'Alternative version for environments where null is hard to input'
        },
        'Clear Cell': {
          code: '[-]',
          description: 'Sets current cell to zero',
          explanation: 'Decrements cell value until it reaches zero'
        },
        'Move Value Right': {
          code: '[->>+<<]',
          description: 'Moves value two cells to the right',
          explanation: 'Decrements source while incrementing destination'
        }
      },
      intermediate: {
        'Add Two Numbers': {
          code: ',>,<[->+<]>.',
          description: 'Adds two single-digit inputs',
          explanation: 'Reads two inputs, adds second to first, outputs result'
        },
        'Uppercase to Lowercase': {
          code: ',----------[----------------------.,----------]',
          description: 'Converts uppercase letters to lowercase',
          explanation: 'Subtracts 32 from ASCII value if not newline'
        },
        'Simple Fibonacci': {
          code: '+.>+.>>>+++++++++++[<<<[->>+<<]>>[-<+<+>>]<<<[->+<]>>[-<<+>>]<.>>>-]',
          description: 'Generates first 10 Fibonacci numbers',
          explanation: 'Uses memory cells to store and add previous two numbers'
        },
        'Copy Cell': {
          code: '[->>+>+<<<]>>>[-<<<+>>>]',
          description: 'Copies value to another cell',
          explanation: 'Uses temporary cell to preserve original value'
        },
        'Multiply': {
          code: '>>[-]>[-]<<[->>+<<][<[+>>+<-]>[<+>-]>-]',
          description: 'Multiplies two numbers',
          explanation: 'Repeatedly adds second number first number of times'
        }
      },
      advanced: {
        'Bubble Sort': {
          code: '>>,[>>,]<<[[-<+<]>[>[>>]<[.[-]<[[>>+<<-]<]>>]>]<<]',
          description: 'Sorts input numbers in ascending order',
          explanation: 'Implements bubble sort algorithm'
        },
        'Text Generator': {
          code: '+++++[>+++++++++<-],[[>--.++>+<<-]>+.->[<.>-]<<,]',
          description: 'Generates BF code that outputs given text',
          explanation: 'Creates Brainfuck code to reproduce input text'
        },
        'Powers of Two': {
          code: '>++++++++++>>+<+[[+++++[>++++++++<-]>.<++++++[>--------<-]+<<]>.>[->[<++>-[<++>-[<++>-[<++>-[<-------->>[-]++<-[<++>-]]]]]]<[>+<-]+>>]<<]',
          description: 'Outputs powers of 2 in decimal',
          explanation: 'Continuously doubles and prints numbers'
        },
        '99 Bottles': {
          code: this.get99BottlesCode(),
          description: '99 Bottles of Beer song',
          explanation: 'Complete implementation with proper grammar'
        },
        'Factorial': {
          code: '>++++++++++>>>+>+[>>>+[-[<<<<<[+<<<<<]>>[[-]>[<<+>+>-]<[>+<-]<[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>[-]>>>>+>+<<<<<<-[>+<-]]]]]]]]]]]>[<+>-]+>>>>>]<<<<<[<<<<<]>>>>>>>[>>>>>]++[-<<<<<]>>>>>>-]+>>>>>]<[>++<-]<<<<[<[>+<-]<<<<]>>[->[-]++++++[<++++++++>-]>>>>]<<<<<[<[>+>+<<-]>.<<<<<]>.>>>>]',
          description: 'Calculates factorials',
          explanation: 'Outputs factorial sequence until stopped'
        }
      },
      fromGuide: {
        'Find Zero': {
          code: '[>]',
          description: 'Finds first zero cell to the right',
          explanation: 'Moves right until zero value found'
        },
        'If Not Zero': {
          code: '>[-]>[-]<<[>+>+<<-]>[<+>-]>[code[-]]',
          description: 'If-then construct template',
          explanation: 'Executes code block if value is not zero'
        },
        'If Zero': {
          code: '>[-]+<[>-]<[code[-]]',
          description: 'If x=0 construct template',
          explanation: 'Executes code block only if value is zero'
        },
        'Compare Equal': {
          code: '[-]>[-]>[-]<<[>+>+<<-]+>[<->[-]]<[>-<[-]]>[code[-]]',
          description: 'Check if two values are equal',
          explanation: 'Sets flag based on comparison result'
        },
        'PI Calculator': {
          code: '>+++++++++++++++[<+>>>>>>>>++++++++++<<<<<<<-]>+++++[<+++++++++>-]+>>>>>>+[<<+++[>>[-<]<[>]<-]>>[>+>]<[<]>]>[[->>>>+<<<<]>>>+++>-]<[<<<<]<<<<<<<<+[->>>>>>>>>>>>[<+[->>>>+<<<<]>>>>>]<<<<[>>>>>[<<<<+>>>>-]<<<<<-[<<++++++++++>>-]>>>[<<[<+<<+>>>-]<[>+<-]<++<<+>>>>>>-]<<[-]<<-<[->>+<-[>>>]>[[<+>-]>+>>]<<<<<]>[-]>+<<<-[>>+<<-]<]<<<<+>>>>>>>>[-]>[<<<+>>>-]<<++++++++++<[->>+<-[>>>]>[[<+>-]>+>>]<<<<<]>[-]>+>[<<+<+>>>-]<<<<+<+>>[-[-[-[-[-[-[-[-[-<->[-<+<->>]]]]]]]]]]<[+++++[<<<++++++++<++++++++>>>>-]<<<<+<->>>>[>+<<<+++++++++<->>>-]<<<<<[>>+<<-]+<[->-<]>[>>.<<<<[+.[-]]>>-]>[>>.<<-]>[-]>[-]>>>[>>[<<<<<<<<+>>>>>>>>-]<<-]]>>[-]<<<[-]<<<<<<<<]++++++++++.',
          description: 'Calculates digits of PI',
          explanation: 'Advanced algorithm for computing PI digits'
        }
      }
    };
  }

  get99BottlesCode() {
    return `>>>>>>>>>++++++++++[-<++++++++++>]<-<<<<<<<<<
++++++++++[->++++>++++>++++>++++<<<<]
++++++++[->>>++++++++>++++++++<<<<]
++++[->>>>++++<<<<]++++++++++>--------
>++++>>>>>>>>>
[
<<<<+++>+>++<<
[
>>>>[
[->+>+<<]>>[-<<+>>]<[>++++++++++[->>+>+<<<]
<[>>>[-<<<-[>]>>>>[<[>]>[---------->>]<++++
++[-<++++++++>]<<[<->[->-<]]>->>>[>]+[<]<<[
->>>[>]<+[<]<<]<>>]<<]<+>>[->+<<+>]>[-<+>]<
<<<<]>>[-<<+>>]<<]>[-]>>>>>>[>]<[.[-]<]
<<<<<<
]>+<<[>]>>
[
<<<<<<<++++++.+.------->>>>>>>>>>>
]
<[-]<[-]<<<<<<<.
>>-------.+++++++++++++.>----..
<---.-------.>>>>>>->>+<<<
[>]>>
[<<<<<<<<-.+>>>>>>>]
>-<<<+<<<<<
<<<.>>>-----.
<+.<<.>>----.+++..>+++.<+++>++++++
>>>>>>>>
[
<<<<<.>>+++++++.-.<<.>>>----.
<------.---.<<.>>>+++.<----. +++++++++++..
---->+>>
-
]
<<<<.<<.>>>>>>>
-
[>]>>
[
-<<<<<
----.
<-------.<<<>>-.>+.<.>>-.>+.++++++++.
---------.<<<.>>>++.<----.---.
++++++.-------.
<+++.++++>++++++++++<<<.<<.>>>>+
>>>>>>>
]
<<<
<<
-
]
>>+<<<<<<<.>>>>>>>>
]`; 
  }

  async browse() {
    const categories = Object.keys(this.examples);
    const { category } = await inquirer.prompt([
      {
        type: 'list',
        name: 'category',
        message: 'Select example category:',
        choices: [
          { name: chalk.green('Basic Examples'), value: 'basic' },
          { name: chalk.yellow('Intermediate Examples'), value: 'intermediate' },
          { name: chalk.red('Advanced Examples'), value: 'advanced' },
          { name: chalk.cyan('Examples from Guide'), value: 'fromGuide' },
          { name: chalk.gray('Exit'), value: 'exit' }
        ]
      }
    ]);

    if (category === 'exit') return;

    const examples = this.examples[category];
    const exampleNames = Object.keys(examples);
    
    const { example } = await inquirer.prompt([
      {
        type: 'list',
        name: 'example',
        message: 'Select an example:',
        choices: [
          ...exampleNames.map(name => ({
            name: `${name} - ${examples[name].description}`,
            value: name
          })),
          { name: chalk.gray('Back'), value: 'back' }
        ]
      }
    ]);

    if (example === 'back') {
      return this.browse();
    }

    const selected = examples[example];
    console.log(chalk.cyan('\n' + example));
    console.log(chalk.gray(selected.description));
    console.log(chalk.yellow('\nExplanation:'), selected.explanation);
    console.log(chalk.green('\nCode:'));
    console.log(this.formatCode(selected.code));

    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          { name: 'Run this example', value: 'run' },
          { name: 'Run with custom input', value: 'runWithInput' },
          { name: 'Step through (debug)', value: 'debug' },
          { name: 'Back to examples', value: 'back' }
        ]
      }
    ]);

    if (action === 'run') {
      await this.runExample(selected.code);
    } else if (action === 'runWithInput') {
      const { input } = await inquirer.prompt([
        {
          type: 'input',
          name: 'input',
          message: 'Enter input for the program:'
        }
      ]);
      await this.runExample(selected.code, input);
    } else if (action === 'debug') {
      await this.debugExample(selected.code);
    }

    await this.browse();
  }

  formatCode(code) {
    if (code.length > 100) {
      const lines = [];
      for (let i = 0; i < code.length; i += 60) {
        lines.push(code.slice(i, i + 60));
      }
      return lines.join('\n');
    }
    return code;
  }

  async runExample(code, input = '') {
    const interpreter = new BrainfuckInterpreter({ input });
    const result = interpreter.execute(code);
    
    console.log('\n' + chalk.cyan('='.repeat(50)));
    if (result.success) {
      console.log(chalk.green('✓ Program executed successfully'));
      if (result.output) {
        console.log(chalk.yellow('Output:'));
        console.log(result.output);
      } else {
        console.log(chalk.gray('(No output)'));
      }
      console.log(chalk.gray(`Iterations: ${result.iterations}`));
    } else {
      console.log(chalk.red('✗ Error:'), result.error);
      if (result.output) {
        console.log(chalk.yellow('Partial output:'), result.output);
      }
    }
    console.log(chalk.cyan('='.repeat(50)) + '\n');

    await inquirer.prompt([
      {
        type: 'input',
        name: 'continue',
        message: 'Press Enter to continue...'
      }
    ]);
  }

  async debugExample(code) {
    console.log(chalk.cyan('Debug mode - step through the program'));
    console.log(chalk.gray('Commands: n (next), m (memory), s (skip to end), q (quit)'));
    
    const interpreter = new BrainfuckInterpreter({ debug: true });
    let stepCount = 0;

    while (true) {
      const result = interpreter.step(code);
      
      if (result.done) {
        console.log(chalk.green('\nProgram finished'));
        console.log(chalk.yellow('Final output:'), interpreter.output || '(empty)');
        break;
      }

      const state = result.state;
      console.log(chalk.gray(`\nStep ${stepCount++}:`));
      console.log(`  Instruction: ${chalk.yellow(state.instruction)} at position ${state.instructionPointer}`);
      console.log(`  Memory[${state.pointer}] = ${state.value}`);
      if (state.output !== interpreter.output) {
        console.log(chalk.green(`  Output: "${interpreter.output}"`));
      }

      const { cmd } = await inquirer.prompt([
        {
          type: 'input',
          name: 'cmd',
          message: '>',
          default: 'n'
        }
      ]);

      if (cmd === 'q') {
        console.log(chalk.yellow('Debug session ended'));
        break;
      } else if (cmd === 'm') {
        console.log(chalk.cyan('Memory snapshot (first 30 cells):'));
        const memory = interpreter.getMemorySnapshot(0, 30);
        console.log(memory.map((v, i) => `[${i}]=${v}`).join(' '));
      } else if (cmd === 's') {
        while (!interpreter.step(code).done) {}
        console.log(chalk.green('Skipped to end'));
        console.log(chalk.yellow('Final output:'), interpreter.output || '(empty)');
        break;
      }
    }

    await inquirer.prompt([
      {
        type: 'input',
        name: 'continue',
        message: 'Press Enter to continue...'
      }
    ]);
  }
}