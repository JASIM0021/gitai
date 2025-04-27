import axios from 'axios';

const AI_PROVIDERS = {
  'gpt-3.5-turbo': {
    url: 'https://api.openai.com/v1/chat/completions',
    getPayload: prompt => ({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }),
  },
  'gpt-4o': {
    url: 'https://api.openai.com/v1/chat/completions',
    getPayload: prompt => ({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }),
  },
  'gemini-2.0-flash': {
    url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    getPayload: prompt => ({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    }),
  },
};

export async function generateCommitMessage(model, apiKey, gitDiff) {
  try {
    const provider = AI_PROVIDERS[model];
    if (!provider) throw new Error('Unsupported model');

    const prompt = `Generate a clear, concise git commit message in imperative mood (e.g., "Fix bug" not "Fixed bug") for these changes. Focus on what changed and why, not how. Use conventional commit style if appropriate.\n\nGit diff:\n${gitDiff}\n\nCommit message:`;

    const response = await axios.post(
      provider.url,
      provider.getPayload(prompt),
      {
        headers: {
          Authorization: model.startsWith('gpt')
            ? `Bearer ${apiKey}`
            : undefined,
          'Content-Type': 'application/json',
          ...(model === 'gemini-2.0-flash' ? { 'x-goog-api-key': apiKey } : {}),
        },
      },
    );

    // Handle different response formats
    let message;
    if (model.startsWith('gpt')) {
      message = response.data.choices[0].message.content;
    } else if (model === 'gemini-2.0-flash') {
      message = response.data.candidates[0].content.parts[0].text;
    }

    return message.trim().replace(/^["']|["']$/g, '');
  } catch (error) {
    console.error('AI Error:', error.response?.data || error.message);
    return null;
  }
}

export async function checkCommitMessage(model, apiKey, commitMessage) {
  try {
    const provider = AI_PROVIDERS[model];
    if (!provider) throw new Error('Unsupported model');

    const prompt = `Check and improve this git commit message for clarity, grammar, spelling, and conventional commit style. Return only the improved message:\n\n"${commitMessage}"\n\nImproved message:`;

    const response = await axios.post(
      provider.url,
      provider.getPayload(prompt),
      {
        headers: {
          Authorization: model.startsWith('gpt')
            ? `Bearer ${apiKey}`
            : undefined,
          'Content-Type': 'application/json',
          ...(model === 'gemini-2.0-flash' ? { 'x-goog-api-key': apiKey } : {}),
        },
      },
    );

    let improvedMessage;
    if (model.startsWith('gpt')) {
      improvedMessage = response.data.choices[0].message.content;
    } else if (model === 'gemini-2.0-flash') {
      improvedMessage = response.data.candidates[0].content.parts[0].text;
    }

    return improvedMessage.trim().replace(/^["']|["']$/g, '') || commitMessage;
  } catch (error) {
    console.error('AI Error:', error.response?.data || error.message);
    return commitMessage; // Return original if error
  }
}

export function createBranchFromIssue(issueUrl) {
  try {
    const url = new URL(issueUrl);
    const pathParts = url.pathname.split('/');
    const issueType = pathParts[pathParts.length - 2];
    const issueNumber = pathParts[pathParts.length - 1];

    if (!issueNumber || isNaN(issueNumber)) {
      throw new Error('Invalid issue URL format');
    }

    // Clean and format branch name
    const repoName = pathParts[2];
    const cleanRepoName = repoName.replace(/[^a-zA-Z0-9]/g, '-');
    return `${issueType}/${cleanRepoName}-${issueNumber}`;
  } catch (error) {
    console.error('Error parsing issue URL:', error.message);
    return null;
  }
}
