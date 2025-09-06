import { BrainfuckInterpreter } from '../src/interpreter.js';
import chalk from 'chalk';

console.log(chalk.cyan.bold('\n🧠 Brainfuck CLI Test Suite\n'));

const tests = [
  {
    name: 'Hello World',
    code: '++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.>.',
    expected: 'Hello World!\n'
  },
  {
    name: 'Cat program',
    code: ',[.,]',
    input: 'test\0',
    expected: 'test'
  },
  {
    name: 'Clear cell',
    code: '+++++[-]',
    expectedMemory: [0]
  },
  {
    name: 'Move value',
    code: '+++[->+<]',
    expectedMemory: [0, 3]
  },
  {
    name: 'Add two numbers',
    code: '++>+++<[->+<]',
    expectedMemory: [0, 5]
  }
];

let passed = 0;
let failed = 0;

for (const test of tests) {
  const interpreter = new BrainfuckInterpreter({ 
    input: test.input || '' 
  });
  
  const result = interpreter.execute(test.code);
  
  if (!result.success) {
    console.log(chalk.red(`✗ ${test.name}: Execution error - ${result.error}`));
    failed++;
    continue;
  }
  
  let testPassed = true;
  
  if (test.expected !== undefined) {
    if (result.output !== test.expected) {
      console.log(chalk.red(`✗ ${test.name}: Output mismatch`));
      console.log(chalk.gray(`  Expected: "${test.expected}"`));
      console.log(chalk.gray(`  Got: "${result.output}"`));
      testPassed = false;
    }
  }
  
  if (test.expectedMemory !== undefined) {
    const memory = interpreter.getMemorySnapshot(0, test.expectedMemory.length);
    if (JSON.stringify(memory) !== JSON.stringify(test.expectedMemory)) {
      console.log(chalk.red(`✗ ${test.name}: Memory mismatch`));
      console.log(chalk.gray(`  Expected: [${test.expectedMemory}]`));
      console.log(chalk.gray(`  Got: [${memory}]`));
      testPassed = false;
    }
  }
  
  if (testPassed) {
    console.log(chalk.green(`✓ ${test.name}`));
    passed++;
  } else {
    failed++;
  }
}

console.log(chalk.cyan('\n' + '='.repeat(40)));
console.log(chalk.cyan(`Tests: ${chalk.green(passed + ' passed')}, ${failed > 0 ? chalk.red(failed + ' failed') : '0 failed'}`));
console.log(chalk.cyan('='.repeat(40) + '\n'));

if (failed === 0) {
  console.log(chalk.green.bold('All tests passed! 🎉'));
  process.exit(0);
} else {
  console.log(chalk.red.bold('Some tests failed.'));
  process.exit(1);
}