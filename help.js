export async function help(){
    console.log(`
    
    BAiSH - Your AI-powered terminal assistant
    
    Usage:
      baish 'describe what you want to do'
      baish <alias>
      baish alias <name> <command>
      baish config model <model>
      baish reset
    
    Flags:
      --model <name>     Use a specific model (e.g., gpt-4, mistral)
      --key <API key>    Use API key without saving it
      --dry              Preview the command without executing it
      --explain          Explain the command before execution
      --version          Show version info
    
    Examples:
      baish 'delete all node_modules folders' --dry
      baish 'give write permission to this file' --explain
      baish config model gpt-4
      baish reset
    
    Alias System:
      baish alias deploy 'git push origin main'
          → Saves the alias 'deploy'
      baish deploy
          → Runs 'git push origin main'
    
    More:
      Website: https://github.com/silv3rh4t/baish
      Models:  https://openrouter.ai
    
    `);
}
