export class BrainfuckInterpreter {
  constructor(options = {}) {
    this.memorySize = options.memorySize || 30000;
    this.memory = new Uint8Array(this.memorySize);
    this.pointer = 0;
    this.instructionPointer = 0;
    this.input = options.input || '';
    this.inputPointer = 0;
    this.output = '';
    this.debug = options.debug || false;
    this.stepCallback = options.stepCallback || null;
    this.maxIterations = options.maxIterations || 1000000;
    this.iterations = 0;
    this.brackets = new Map();
    this.history = [];
  }

  reset() {
    this.memory.fill(0);
    this.pointer = 0;
    this.instructionPointer = 0;
    this.inputPointer = 0;
    this.output = '';
    this.iterations = 0;
    this.history = [];
  }

  preprocess(code) {
    const cleanCode = code.replace(/[^><+\-.,[\]]/g, '');
    const stack = [];
    this.brackets.clear();
    
    for (let i = 0; i < cleanCode.length; i++) {
      if (cleanCode[i] === '[') {
        stack.push(i);
      } else if (cleanCode[i] === ']') {
        if (stack.length === 0) {
          throw new Error(`Unmatched ] at position ${i}`);
        }
        const start = stack.pop();
        this.brackets.set(start, i);
        this.brackets.set(i, start);
      }
    }
    
    if (stack.length > 0) {
      throw new Error(`Unmatched [ at position ${stack[0]}`);
    }
    
    return cleanCode;
  }

  execute(code, options = {}) {
    this.reset();
    Object.assign(this, options);
    
    try {
      code = this.preprocess(code);
    } catch (error) {
      return { success: false, error: error.message, output: this.output };
    }

    while (this.instructionPointer < code.length) {
      if (this.iterations++ > this.maxIterations) {
        return { 
          success: false, 
          error: `Maximum iterations (${this.maxIterations}) exceeded`, 
          output: this.output 
        };
      }

      const instruction = code[this.instructionPointer];
      
      if (this.debug) {
        this.history.push({
          instruction,
          pointer: this.pointer,
          value: this.memory[this.pointer],
          instructionPointer: this.instructionPointer
        });
      }

      if (this.stepCallback) {
        this.stepCallback({
          instruction,
          pointer: this.pointer,
          memory: [...this.memory.slice(0, 100)],
          instructionPointer: this.instructionPointer,
          output: this.output
        });
      }

      switch (instruction) {
        case '>':
          this.pointer++;
          if (this.pointer >= this.memorySize) {
            return { success: false, error: 'Memory overflow', output: this.output };
          }
          break;
          
        case '<':
          this.pointer--;
          if (this.pointer < 0) {
            return { success: false, error: 'Memory underflow', output: this.output };
          }
          break;
          
        case '+':
          this.memory[this.pointer] = (this.memory[this.pointer] + 1) & 0xFF;
          break;
          
        case '-':
          this.memory[this.pointer] = (this.memory[this.pointer] - 1) & 0xFF;
          break;
          
        case '.':
          this.output += String.fromCharCode(this.memory[this.pointer]);
          break;
          
        case ',':
          if (this.inputPointer < this.input.length) {
            this.memory[this.pointer] = this.input.charCodeAt(this.inputPointer++);
          } else {
            this.memory[this.pointer] = 0;
          }
          break;
          
        case '[':
          if (this.memory[this.pointer] === 0) {
            this.instructionPointer = this.brackets.get(this.instructionPointer);
          }
          break;
          
        case ']':
          if (this.memory[this.pointer] !== 0) {
            this.instructionPointer = this.brackets.get(this.instructionPointer);
          }
          break;
      }
      
      this.instructionPointer++;
    }

    return { 
      success: true, 
      output: this.output,
      iterations: this.iterations,
      finalMemory: this.debug ? [...this.memory.slice(0, 100)] : null,
      history: this.debug ? this.history : null
    };
  }

  step(code) {
    if (!this.currentCode) {
      this.reset();
      this.currentCode = this.preprocess(code);
    }

    if (this.instructionPointer >= this.currentCode.length) {
      return { done: true, output: this.output };
    }

    const instruction = this.currentCode[this.instructionPointer];
    const state = {
      instruction,
      pointer: this.pointer,
      value: this.memory[this.pointer],
      instructionPointer: this.instructionPointer,
      output: this.output
    };

    switch (instruction) {
      case '>':
        this.pointer++;
        break;
      case '<':
        this.pointer--;
        break;
      case '+':
        this.memory[this.pointer] = (this.memory[this.pointer] + 1) & 0xFF;
        break;
      case '-':
        this.memory[this.pointer] = (this.memory[this.pointer] - 1) & 0xFF;
        break;
      case '.':
        this.output += String.fromCharCode(this.memory[this.pointer]);
        break;
      case ',':
        if (this.inputPointer < this.input.length) {
          this.memory[this.pointer] = this.input.charCodeAt(this.inputPointer++);
        } else {
          this.memory[this.pointer] = 0;
        }
        break;
      case '[':
        if (this.memory[this.pointer] === 0) {
          this.instructionPointer = this.brackets.get(this.instructionPointer);
        }
        break;
      case ']':
        if (this.memory[this.pointer] !== 0) {
          this.instructionPointer = this.brackets.get(this.instructionPointer);
        }
        break;
    }

    this.instructionPointer++;
    return { done: false, state };
  }

  getMemorySnapshot(start = 0, length = 20) {
    return Array.from(this.memory.slice(start, start + length));
  }
}