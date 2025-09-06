# Brainfuck CLI Learning Tool

An interactive command-line tool for learning and mastering the Brainfuck programming language.

## 🚀 Quick Start

```bash
# Automated setup
./setup.sh

# Or manual installation
npm install
npm link  # Makes 'bf' command available globally
```

## 📁 Project Structure

```
brainfuck-cli/
├── bin/            # Executable scripts
│   └── bf          # Main CLI executable
├── src/            # Source code
│   ├── cli.js      # CLI interface
│   ├── interpreter.js  # Brainfuck interpreter
│   ├── tutorial.js     # Interactive tutorial
│   ├── examples.js     # Example programs
│   ├── exercises.js    # Practice exercises
│   ├── visualizer.js   # Memory visualization
│   └── config.js       # Configuration
├── data/           # Data files
│   ├── examples/   # Example .bf files
│   └── exercises/  # Exercise data
├── tests/          # Test files
└── package.json    # NPM configuration
```

## Usage

### Run a Brainfuck file
```bash
bf run hello.bf
bf run hello.bf -i "input string"  # With input
bf run hello.bf -d                 # Debug mode
bf run hello.bf -v                 # With visualization
```

### Execute code directly
```bash
bf exec "++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++."
bf exec ",[.,]" -i "Hello"
```

### Interactive tutorial
```bash
bf tutorial
```

### Browse examples
```bash
bf examples
```

### Practice exercises
```bash
bf exercise           # Choose difficulty
bf exercise beginner  # Start beginner exercises
```

### Debug programs
```bash
bf debug program.bf
```

### Generate Brainfuck code
```bash
bf generate "Hello World"
```

### Visualize execution
```bash
bf visualize "+++++[->+<]"
```

## Commands Reference

| Command | Description |
|---------|------------|
| `run <file>` | Execute a Brainfuck file |
| `exec <code>` | Execute Brainfuck code directly |
| `tutorial` | Start interactive tutorial |
| `examples` | Browse and run example programs |
| `exercise [level]` | Practice with exercises |
| `debug <file>` | Step-through debugger |
| `generate <text>` | Generate BF code for text |
| `visualize <code>` | Animate code execution |

## Brainfuck Language Reference

| Command | Description |
|---------|------------|
| `>` | Move pointer right |
| `<` | Move pointer left |
| `+` | Increment current cell |
| `-` | Decrement current cell |
| `.` | Output ASCII character |
| `,` | Input one byte |
| `[` | Jump to ] if cell is 0 |
| `]` | Jump to [ if cell is not 0 |

## Features

- ✅ Full Brainfuck interpreter
- ✅ Interactive tutorial with 10 lessons
- ✅ 40+ example programs from the guide
- ✅ Progressive exercises (beginner to advanced)
- ✅ Memory visualization
- ✅ Step-by-step debugger
- ✅ Code generation from text
- ✅ Execution animation
- ✅ Comprehensive test suite

## Example Programs Included

### Basic
- Hello World
- Cat (Echo)
- Clear Cell
- Move Value

### Intermediate
- Add Numbers
- Multiplication
- Fibonacci
- Uppercase/Lowercase converter

### Advanced
- Bubble Sort
- PI Calculator
- Powers of Two
- 99 Bottles of Beer
- Factorial Calculator

## Learning Path

1. Start with `bf tutorial` to learn basics
2. Practice with `bf exercise beginner`
3. Explore `bf examples` to see real programs
4. Use `bf debug` to understand complex programs
5. Challenge yourself with advanced exercises

## Based on "Brainfuck for Dummies"

This tool implements concepts and examples from the comprehensive Brainfuck guide, making it easy to learn through hands-on practice.