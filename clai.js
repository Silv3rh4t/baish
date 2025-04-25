
import { exec } from 'child_process';
import readline from 'readline';
import {
  generateCommand,
  explainCommand
} from './ai.js';
import {
  getApiKey,
  resetConfig,
  getDefaultModel,
  setDefaultModel,
  saveAlias,
  getAlias
} from './config.js';
import { help } from './help.js';

const args = process.argv.slice(2);

if (args[0] === 'help') {
  help();
  process.exit();
}

if (args.includes('reset')) {
  resetConfig();
  process.exit();
}

// ALIAS HANDLING
if (args[0] === 'alias' && args[1] && args[2]) {
  const aliasName = args[1];
  const command = args.slice(2).join(' ');
  saveAlias(aliasName, command);
  process.exit();
}

// Run alias
const aliasCommand = getAlias(args[0]);
if (aliasCommand) {
  console.log(`> Running alias '${args[0]}': ${aliasCommand}`);
  exec(aliasCommand, (err, stdout, stderr) => {
    if (err) console.error(stderr);
    else console.log(stdout);
  });
  process.exit();
}

// flags
let keyFromArg = null;
let modelFromArg = null;
let dryRun = false;
let explainMode = false;

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

if (args.includes('--dry')) {
  dryRun = true;
  args.splice(args.indexOf('--dry'), 1);
}

if (args.includes('--explain')) {
  explainMode = true;
  args.splice(args.indexOf('--explain'), 1);
}

const input = args.join(' ');
if (!input) {
  console.log("Usage: clai 'do something' [--dry] [--explain] [--model <name>] [--key <key>]\nRun 'clai help' for more.");
  process.exit();
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, res));

async function main() {
  const selectedModel = modelFromArg || getDefaultModel();
  const command = await generateCommand(input, keyFromArg, selectedModel);

  console.log(`\n> Model: ${selectedModel}`);
  console.log(`> Suggested command:\n\n  ${command}\n`);

  if (explainMode) {
    const explanation = await explainCommand(command, keyFromArg, selectedModel);
    console.log(`> Explanation:\n\n  ${explanation}\n`);
  }

  if (dryRun) {
    console.log("(Dry run — command not executed.)\n");
    rl.close();
    return;
  }

  const confirm = await ask("Run it? (Y/n): ");
  rl.close();

  if (confirm.toLowerCase() === 'y' || confirm === '') {
    exec(command, (err, stdout, stderr) => {
      if (err) console.error(`Error: ${stderr}`);
      else console.log(stdout);
    });
  } else {
    console.log("❌ Command cancelled.");
  }
}

main();
