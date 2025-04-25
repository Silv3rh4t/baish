import { exec } from 'child_process';
import readline from 'readline';
import { generateCommand } from './ai.js';
import { getApiKey, resetConfig, getDefaultModel, setDefaultModel } from './config.js';

const args = process.argv.slice(2);

// RESET
if (args.includes('reset')) {
  resetConfig();
  process.exit();
}

// SET DEFAULT MODEL: clai config model gpt-4
if (args[0] === 'config' && args[1] === 'model' && args[2]) {
  setDefaultModel(args[2]);
  process.exit();
}

// --key + --model
let keyFromArg = null;
let modelFromArg = null;

const keyIndex = args.indexOf('--key');
if (keyIndex !== -1 && args[keyIndex + 1]) {
  keyFromArg = args[keyIndex + 1];
  args.splice(keyIndex, 2);
}

const modelIndex = args.indexOf('--model');
if (modelIndex !== -1 && args[modelIndex + 1]) {
  modelFromArg = args[modelIndex + 1];
  args.splice(modelIndex, 2);
}

const input = args.join(' ');
if (!input) {
  console.log("Usage: clai 'do something' [--model gpt-4] [--key sk-...]");
  console.log("       clai config model mistralai/mistral-7b-instruct");
  console.log("       clai reset\n");
  process.exit();
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, res));

async function main() {
  const selectedModel = modelFromArg || getDefaultModel();
  const command = await generateCommand(input, keyFromArg, selectedModel);

  console.log(`\n> Model: ${selectedModel}`);
  console.log(`> Suggested command:\n\n  ${command}\n`);

  const confirm = await ask("Run it? (Y/n): ");
  rl.close();

  if (confirm.toLowerCase() === 'y' || confirm === '') {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error(`Error: ${stderr}`);
      } else {
        console.log(stdout);
      }
    });
  } else {
    console.log("❌ Command cancelled.");
  }
}

main();
