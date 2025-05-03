# 🤖 GitAI - AI-Powered Git Assistant

Supercharge your Git workflow with AI! GitAI helps developers write better commit messages, automate branch creation, and maintain consistent Git practices.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/gitcliai.svg)](https://www.npmjs.com/package/gitcliai)

---

## 🎥 Demo

<img width="582" alt="image" src="https://github.com/user-attachments/assets/5d7be3b5-74bc-4a90-9e10-9e005a1ac467" />



---

## ✨ Features

- **AI-Generated Commit Messages**: Automatically generate meaningful commit messages from staged changes
- **Commit Message Checking**: Fix spelling/grammar mistakes in your commit messages
- **Smart Branch Creation**: Create branches from GitHub issue URLs automatically
- **Git Command Passthrough**: All standard Git commands work normally
- **Multi-Model Support**: Choose between GPT-3.5, GPT-4, or Gemini AI models

---

## 📦 Installation

### Global Installation (Recommended)

```bash
npm install -g gitcliai
```

### Using npx (No Installation)

```bash
npx gitcliai <command>
```

### Via cURL (Mac/Linux)

```bash
curl -sSL https://raw.githubusercontent.com/JASIM0021/gitai/refs/heads/master/install.sh | bash
```

### Windows (PowerShell)

```powershell
irm https://raw.githubusercontent.com/JASIM0021/gitai/refs/heads/master/install.ps1 | iex
```

---

## 🚀 Usage

### Fix staged changes with AI-generated message

```bash
gitai commit --fix-commit
```

### Check and improve a commit message

```bash
gitai commit --spell-check "fix login bugg"
```

### Create branch from GitHub issue

```bash
gitai checkout -b --issue https://github.com/user/repo/issues/123
```

### Regular Git commands

```bash
gitai status
gitai push
gitai log --oneline
```

---

## 🛠 Commands

| Command              | Description                                 |
| -------------------- | ------------------------------------------- |
| commit --fix-commit (-fc) | Generate commit message from staged changes |
| commit --spell-check (-sc) | Improve an existing commit message          |
| checkout -b --issue (-i) | Create branch from GitHub issue URL         |
| [any git command]    | Pass through to standard Git                |

---

## ⚙️ Configuration

First run will prompt for:

- AI Model Selection (GPT-3.5, GPT-4, or Gemini)
- API Key for your chosen provider

Credentials are stored securely in:

- `~/.gitai_config` (model preference)
- `~/.gitai_key` (API key with restricted permissions)

---

## 🧑‍💻 For Contributors

We welcome contributions! Here's how to get started:

### Development Setup

Clone the repo:

```bash
git clone https://github.com/JASIM0021/gitai
cd gitai
```

Install dependencies:

```bash
npm install
```

Link for local development:

```bash
npm link
```

### Project Structure

```
src/
├── main.js          # CLI entry point
├── ai/              # AI integration logic
├── config/          # Configuration handling
```

### Testing

```bash
npm test
```

### Publishing Changes

Update version in `package.json`

Run:

```bash
npm publish
```

---

## 📜 License

MIT License © SK Jasimuddin

---

## 🙏 Acknowledgements

Inspired by:

- Conventional Commits
- GitLens
- Vs Code
- Cursor

---

## 📬 Feedback

Found a bug? Have a feature request?  
Open an issue or submit a PR!

⭐ Star the repo if you find this useful!
