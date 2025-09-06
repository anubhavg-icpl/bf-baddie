# Installation Guide

## Quick Install (Global)

```bash
# Clone the repository
git clone https://github.com/yourusername/brainfuck-cli.git
cd brainfuck-cli

# Install dependencies
npm install

# Install globally
npm link

# Now you can use 'bf' command anywhere
bf --help
```

## Manual Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Run locally:**
```bash
node bin/bf --help
```

3. **Or use npm scripts:**
```bash
npm start -- --help
```

## Verify Installation

Test the installation:
```bash
# Test execution
bf exec "++++++++[>++++++++<-]>+."  # Should output 'A'

# Test file execution
bf run data/examples/hello.bf      # Should output 'Hello World!'

# Run tests
npm test
npm run test:full
```

## Uninstall

```bash
npm unlink -g brainfuck-cli
```

## Troubleshooting

If `bf` command is not found:
1. Make sure npm's global bin directory is in your PATH
2. Run `npm list -g --depth=0` to verify installation
3. Try running with `npx bf` instead