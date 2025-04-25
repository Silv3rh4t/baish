// config.js
import fs from 'fs';
import os from 'os';
import path from 'path';
import readline from 'readline';

const configPath = path.join(os.homedir(), '.clai', 'config.json');

function loadConfig() {
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }
  return {};
}

function saveConfig(config) {
  fs.mkdirSync(path.dirname(configPath), { recursive: true });
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

export async function getApiKey(cliKey = null) {
  if (cliKey) return cliKey;
  const config = loadConfig();
  if (config.OPENROUTER_API_KEY) return config.OPENROUTER_API_KEY;

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ask = (q) => new Promise((res) => rl.question(q, res));
  const key = await ask("Enter your OpenRouter API key: ");
  rl.close();

  config.OPENROUTER_API_KEY = key;
  config.MODEL = config.MODEL || "mistralai/mistral-7b-instruct";
  saveConfig(config);

  console.log("✅ API key saved to ~/.clai/config.json\n");
  return key;
}

export function getDefaultModel() {
  const config = loadConfig();
  return config.MODEL || "mistralai/mistral-7b-instruct";
}

export function setDefaultModel(newModel) {
  const config = loadConfig();
  config.MODEL = newModel;
  saveConfig(config);
  console.log(`✅ Default model set to \"${newModel}\"`);
}

export function resetConfig() {
  if (fs.existsSync(configPath)) {
    fs.unlinkSync(configPath);
    console.log("🧹 Config reset: ~/.clai/config.json removed.");
  } else {
    console.log("No config file found to delete.");
  }
}

export function saveAlias(name, command) {
  const config = loadConfig();
  config.ALIASES = config.ALIASES || {};
  config.ALIASES[name] = command;
  saveConfig(config);
  console.log(`✅ Alias '${name}' saved.`);
}

export function getAlias(name) {
  const config = loadConfig();
  return config.ALIASES?.[name] || null;
}
