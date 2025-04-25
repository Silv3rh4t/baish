export async function help(){
    console.log(`
    
    CLaI - Your AI-powered terminal assistant
    
    Usage:
      clai 'describe what you want to do'
      clai <alias>
      clai alias <name> <command>
      clai config model <model>
      clai reset
    
    Flags:
      --model <name>     Use a specific model (e.g., gpt-4, mistral)
      --key <API key>    Use API key without saving it
      --dry              Preview the command without executing it
      --explain          Explain the command before execution
      --version          Show version info
    
    Examples:
      clai 'delete all node_modules folders' --dry
      clai 'give write permission to this file' --explain
      clai config model gpt-4
      clai reset
    
    Alias System:
      clai alias deploy 'git push origin main'
          → Saves the alias 'deploy'
      clai deploy
          → Runs 'git push origin main'
    
    More:
      Website: https://github.com/silv3rh4t/clai
      Models:  https://openrouter.ai
    
    `);
}
