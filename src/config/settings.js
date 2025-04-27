import fs from 'fs';
import path from 'path';
import os from 'os';
import chalk from 'chalk';

const CONFIG_PATH = path.join(os.homedir(), '.gitai_config');
const KEY_FILE = path.join(os.homedir(), '.gitai_key');

function getSecureCredentials() {
  try {
    if (!fs.existsSync(CONFIG_PATH) || !fs.existsSync(KEY_FILE)) {
      return { model: null, apiKey: null };
    }

    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    const apiKey = fs.readFileSync(KEY_FILE, 'utf-8').trim();

    return {
      model: config.model,
      apiKey: apiKey,
    };
  } catch (error) {
    return { model: null, apiKey: null };
  }
}

function saveSecureCredentials(model, apiKey) {
  try {
    // Store model in regular config file
    fs.writeFileSync(CONFIG_PATH, JSON.stringify({ model }, null, 2));

    // Store API key in separate file with restricted permissions
    fs.writeFileSync(KEY_FILE, apiKey, { mode: 0o600 });

    console.log(chalk.green('\n✅ Configuration saved securely!'));
    return true;
  } catch (error) {
    console.error(chalk.red('\n❌ Error saving configuration:'), error);
    return false;
  }
}

export const getCredentials = getSecureCredentials;
export const saveCredentials = saveSecureCredentials;
