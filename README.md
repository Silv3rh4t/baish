# Clai — Your AI-Powered Terminal Assistant

Clai (short for **Command Line AI**) is a terminal tool that turns plain English into shell commands using OpenRouter-powered LLMs like GPT-4, Mistral, Claude, and others.

No more Googling for syntax or stackoverflow diving. Just ask, and Clai will suggest the right command — with options to preview, explain, and save as aliases.

---

## Features

- Converts natural language to terminal commands
- Supports `--explain` mode for breakdowns
- `--dry` run mode to preview before execution
- Alias system (`clai alias deploy 'git push'`)
- Persistent config (API key + default model)
- One-time `--key` and `--model` overrides
- Built on Node.js + OpenRouter + your preferred LLM

---

## Installation

```bash
npm install -g clai
```

Or run directly (future):
```bash
npx clai "show hidden files"
```

---

## 🔑 First Run Setup

Clai will prompt for your **OpenRouter API key** on first run and save it securely in `~/.clai/config.json`.

---

## 🧠 Usage

```bash
clai "make all .sh files executable"
```

```bash
clai "remove all node_modules folders" --dry
```

```bash
clai "chmod file" --explain
```

---

## ⚙️ Config

```bash
clai config model gpt-4
clai reset
```

---

## 🔁 Aliases

```bash
clai alias deploy "git push origin main"
clai deploy
```

---

## 🧪 Flags

| Flag         | Description                              |
|--------------|------------------------------------------|
| `--model`    | Temporarily use a specific model         |
| `--key`      | Temporarily use a specific API key       |
| `--dry`      | Don't run the command, just preview it   |
| `--explain`  | Show a human-readable explanation        |

---

## 🔍 Help

```bash
clai help
```

---

##  License

MIT © 2025 Akhand Yaduvanshi

