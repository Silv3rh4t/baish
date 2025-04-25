#!/usr/bin/env node
import fs from 'fs';
import os from 'os';
import path from 'path';
import readline from 'readline';
import { generateCommand } from './ai.js';
import { exec } from 'child_process';

const configPath = path.join(os.homedir(), '.clai', 'config.json');

export async function getApiKey() {
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    return config.OPENROUTER_API_KEY;
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const ask = (q) => new Promise((res) => rl.question(q, res));
  const key = await ask("Enter your OpenRouter API key: ");
  rl.close();

  fs.mkdirSync(path.dirname(configPath), { recursive: true });
  fs.writeFileSync(configPath, JSON.stringify({ OPENROUTER_API_KEY: key }));

  console.log("✅ API key saved to ~/.clai/config.json\n");
  return key;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (q) => new Promise((res) => rl.question(q, res));

async function main() {
  const input = process.argv.slice(2).join(' ');
  if (!input) {
    console.log("Usage: clai 'describe what you want to do'");
    rl.close();
    return;
  }

  const command = await generateCommand(input);
  console.log(`\n> Suggested command:\n\n  ${command}\n`);
  const confirm = await ask("Run it? (Y/n): ");

  if (confirm.toLowerCase() === 'y' || confirm === '') {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error(`Error: ${stderr}`);
      } else {
        console.log(stdout);
      }
      rl.close();
    });
  } else {
    console.log("Command canceled.");
    rl.close();
  }
}

main();
