import { BrainfuckInterpreter } from './interpreter.js';
import chalk from 'chalk';

console.log(chalk.cyan.bold('\n🧠 Comprehensive Brainfuck CLI Test Report\n'));

const tests = [
  // Basic Commands
  {
    category: 'Basic Commands',
    name: 'Increment cell',
    code: '+++',
    expectedMemory: [3]
  },
  {
    category: 'Basic Commands',
    name: 'Decrement cell',
    code: '+++++---',
    expectedMemory: [2]
  },
  {
    category: 'Basic Commands',
    name: 'Move pointer right',
    code: '+>++',
    expectedMemory: [1, 2]
  },
  {
    category: 'Basic Commands',
    name: 'Move pointer left',
    code: '+>++<+++',
    expectedMemory: [4, 2]
  },
  
  // I/O Operations
  {
    category: 'I/O',
    name: 'Output character',
    code: '++++++++[>++++++++<-]>+.',
    expected: 'A'
  },
  {
    category: 'I/O',
    name: 'Input and output',
    code: ',.',
    input: 'X',
    expected: 'X'
  },
  
  // Loops
  {
    category: 'Loops',
    name: 'Clear cell',
    code: '+++++[-]',
    expectedMemory: [0]
  },
  {
    category: 'Loops',
    name: 'Move value',
    code: '+++[->+<]',
    expectedMemory: [0, 3]
  },
  {
    category: 'Loops',
    name: 'Copy value',
    code: '+++[->+>+<<]>>[-<<+>>]',
    expectedMemory: [3, 3, 0]
  },
  
  // Complex Operations
  {
    category: 'Complex',
    name: 'Addition',
    code: '++>+++<[->+<]',
    expectedMemory: [0, 5]
  },
  {
    category: 'Complex',
    name: 'Multiplication',
    code: '+++[->++++<]',
    expectedMemory: [0, 12]
  },
  {
    category: 'Complex',
    name: 'Hello World',
    code: '++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.>.',
    expected: 'Hello World!\n'
  },
  
  // Edge Cases
  {
    category: 'Edge Cases',
    name: 'Nested loops',
    code: '++[->+[->++<]<]>>',
    expectedMemory: [0, 0, 4]
  },
  {
    category: 'Edge Cases',
    name: 'Empty loop',
    code: '[]',
    expectedMemory: [0]
  },
  
  // Error Detection
  {
    category: 'Error Detection',
    name: 'Unmatched bracket',
    code: '[+',
    shouldFail: true,
    expectedError: 'Unmatched ['
  },
  {
    category: 'Error Detection',
    name: 'Memory underflow',
    code: '<',
    shouldFail: true,
    expectedError: 'Memory underflow'
  }
];

const results = {
  passed: 0,
  failed: 0,
  categories: {}
};

// Run tests by category
for (const test of tests) {
  if (!results.categories[test.category]) {
    results.categories[test.category] = { passed: 0, failed: 0 };
  }
  
  const interpreter = new BrainfuckInterpreter({ 
    input: test.input || '' 
  });
  
  const result = interpreter.execute(test.code);
  
  let testPassed = false;
  
  if (test.shouldFail) {
    if (!result.success && result.error.includes(test.expectedError)) {
      testPassed = true;
    } else {
      console.log(chalk.red(`✗ ${test.name}: Expected error "${test.expectedError}" but got ${result.success ? 'success' : result.error}`));
    }
  } else {
    if (!result.success) {
      console.log(chalk.red(`✗ ${test.name}: Execution error - ${result.error}`));
    } else {
      testPassed = true;
      
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
    }
  }
  
  if (testPassed) {
    results.passed++;
    results.categories[test.category].passed++;
  } else {
    results.failed++;
    results.categories[test.category].failed++;
  }
}

// Display results
console.log(chalk.cyan('\n' + '='.repeat(50)));
console.log(chalk.cyan.bold('Test Results by Category:\n'));

for (const [category, stats] of Object.entries(results.categories)) {
  const total = stats.passed + stats.failed;
  const percentage = Math.round((stats.passed / total) * 100);
  const color = percentage === 100 ? chalk.green : percentage >= 80 ? chalk.yellow : chalk.red;
  
  console.log(`${category}: ${color(`${stats.passed}/${total} (${percentage}%)`)}`);
}

console.log(chalk.cyan('\n' + '='.repeat(50)));
console.log(chalk.cyan.bold('Overall Results:'));
console.log(`Total Tests: ${results.passed + results.failed}`);
console.log(`Passed: ${chalk.green(results.passed)}`);
console.log(`Failed: ${results.failed > 0 ? chalk.red(results.failed) : '0'}`);

const percentage = Math.round((results.passed / (results.passed + results.failed)) * 100);
console.log(`Success Rate: ${percentage}%`);

console.log(chalk.cyan('='.repeat(50) + '\n'));

if (results.failed === 0) {
  console.log(chalk.green.bold('✅ All tests passed! The Brainfuck CLI is working perfectly!'));
} else {
  console.log(chalk.red.bold('⚠️  Some tests failed. Please review the errors above.'));
}

process.exit(results.failed === 0 ? 0 : 1);