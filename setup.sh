#!/bin/bash

echo "🧠 Brainfuck CLI Setup"
echo "====================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Make bin executable
chmod +x bin/bf

# Run tests
echo ""
echo "🧪 Running tests..."
npm test

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ All tests passed!"
else
    echo ""
    echo "⚠️  Some tests failed. Please check the errors above."
    exit 1
fi

# Option to install globally
echo ""
read -p "Would you like to install the 'bf' command globally? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌍 Installing globally..."
    npm link
    echo ""
    echo "✅ Installation complete! You can now use 'bf' command anywhere."
    echo ""
    echo "Try these commands:"
    echo "  bf --help"
    echo "  bf exec '++++++++[>++++++++<-]>+.'"
    echo "  bf tutorial"
    echo "  bf examples"
else
    echo ""
    echo "✅ Setup complete! You can run the CLI locally with:"
    echo "  node bin/bf --help"
    echo "  npm start -- --help"
fi

echo ""
echo "📚 For more information, see README.md"
echo "Happy Brainfucking! 🎉"