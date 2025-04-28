#!/usr/bin/env node
import { Command } from 'commander';
import { getCredentials, saveCredentials } from './config/settings.js';
import {
  generateCommitMessage,
  checkCommitMessage,
  createBranchFromIssue,
} from './ai/prompt.js';
import inquirer from 'inquirer';
import { execSync } from 'child_process';
import chalk from 'chalk';
import fs from 'fs';

const program = new Command();

program.name('gitai').description('AI-powered Git assistant').version('1.0.0');

// Update commit command handler
program
  .command('commit')
  .description('Create a commit with AI assistance')
  .option('-m, --message <message>', 'Commit message')
  .option('-fc, --fix-commit', 'Fix staged changes commit message using AI')
  .option(
    '-sc, --spell-check <message>',
    'Check spelling and grammar of commit message',
  )
  .action(async options => {
    const credentials = await ensureCredentials();

    console.log('options.fixCommit', options);
    if (options.fixCommit) {
      await handleFixCommit(credentials);
    } else if (options.spellCheck) {
      await handleSpellCheck(credentials, options.spellCheck);
    } else if (options.message) {
      execSync(`git commit -m "${options.message}"`, { stdio: 'inherit' });
    } else {
      console.log(
        chalk.yellow(
          'Please provide a commit message or use -fc/-sc flags for AI assistance',
        ),
      );
      process.exit(1);
    }
  });

// Checkout command with issue URL support
program
  .command('checkout')
  .description('Checkout or create branch with AI assistance')
  .option('-b, --branch', 'Create new branch')
  .option('-i, --issue <url>', 'Create branch from GitHub issue URL')
  .action(async options => {
    if (options.branch && options.issue) {
      await handleIssueBranchCreation(options.issue);
    } else {
      // Fall back to normal git checkout
      execSync(`git checkout ${process.argv.slice(3).join(' ')}`, {
        stdio: 'inherit',
      });
    }
  });

// Handle regular git commands
program.command('*', { isDefault: true }).action(() => {
  // Pass through to git
  execSync(`git ${process.argv.slice(2).join(' ')}`, { stdio: 'inherit' });
});

async function ensureCredentials() {
  let credentials = getCredentials();

  if (!credentials.model || !credentials.apiKey) {
    console.log(chalk.blue('\n🔐 GitAI First-Time Setup'));
    console.log(
      chalk.gray('We need to configure your AI provider credentials\n'),
    );

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'model',
        message: 'Select an AI model:',
        choices: [
          { name: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' },
          { name: 'GPT-4o', value: 'gpt-4o' },
          { name: 'gemini-2.0-flash', value: 'gemini-2.0-flash' },
        ],
        default: 'gemini-2.0-flash',
      },
      {
        type: 'password',
        name: 'apiKey',
        message: 'Enter your API key:',
        mask: '*',
        validate: input =>
          input.length > 10 ? true : 'Please enter a valid API key',
      },
    ]);

    const success = await saveCredentials(answers.model, answers.apiKey);
    if (!success) {
      console.log(chalk.red('\nFailed to save credentials. Please try again.'));
      process.exit(1);
    }
    // Reload credentials after saving
    credentials = getCredentials();
  }

  return credentials;
}

async function handleFixCommit(credentials) {
  try {
    const gitDiff = execSync('git diff --staged').toString();
    if (!gitDiff.trim()) {
      console.log(
        chalk.red('No staged changes found. Please stage your changes first.'),
      );
      return;
    }

    console.log(
      chalk.blue('\nGenerating commit message from staged changes...'),
    );
    const commitMessage = await generateCommitMessage(
      credentials.model,
      credentials.apiKey,
      gitDiff,
    );

    if (commitMessage) {
      execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
      console.log(
        chalk.green('\n✅ Commit created with AI-generated message!'),
      );
    }
  } catch (error) {
    console.error(chalk.red('Error  fixing commit:'), error);
  }
}

async function handleSpellCheck(credentials, message) {
  try {
    console.log(chalk.blue('\nChecking commit message...'));
    const checkedMessage = await checkCommitMessage(
      credentials.model,
      credentials.apiKey,
      message,
    );

    if (checkedMessage && checkedMessage !== message) {
      console.log(chalk.yellow('\nOriginal message:'), message);
      console.log(chalk.green('Improved message:'), checkedMessage);

      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: 'Use this improved message?',
          default: true,
        },
      ]);

      if (confirm) {
        // First stage all changes
        try {
          execSync('git add .', { stdio: 'inherit' });
        } catch (addError) {
          console.error(chalk.red('Error staging changes:'), addError);
          return;
        }

        // Create commit using file-based approach to handle special characters
        const tempFile = '.git_commit_msg';
        try {
          fs.writeFileSync(tempFile, checkedMessage);
          execSync(`git commit -F ${tempFile}`, { stdio: 'inherit' });
          fs.unlinkSync(tempFile);
          console.log(
            chalk.green('\n✅ Commit created with improved message!'),
          );
        } catch (commitError) {
          console.error(chalk.red('Error creating commit:'), commitError);
          if (fs.existsSync(tempFile)) {
            fs.unlinkSync(tempFile);
          }
        }
      }
    } else {
      // Handle case where no improvements were suggested
      try {
        execSync('git add .', { stdio: 'inherit' });
        execSync(`git commit -m "${message.replace(/"/g, '\\"')}"`, {
          stdio: 'inherit',
        });
        console.log(
          chalk.green('\n✅ Commit created (no improvements suggested)!'),
        );
      } catch (error) {
        console.error(chalk.red('Error creating commit:'), error);
      }
    }
  } catch (error) {
    console.error(chalk.red('Error checking commit message:'), error);
  }
}
async function handleIssueBranchCreation(issueUrl) {
  try {
    const branchName = createBranchFromIssue(issueUrl);
    if (branchName) {
      execSync(`git checkout -b ${branchName}`, { stdio: 'inherit' });
      console.log(
        chalk.green(`\n✅ Branch "${branchName}" created and checked out!`),
      );
    }
  } catch (error) {
    console.error(chalk.red('Error creating branch from issue:'), error);
  }
}

program.parse(process.argv);
