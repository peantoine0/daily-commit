import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.PERSONAL_TOKEN,
});

const owner = 'peantoine0';
const repo = 'daily-commit';
const readmePath = 'README.md';

async function updateGitHubReadme() {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: readmePath,
    });

    const sha = data.sha;
    const currentDate = new Date().toLocaleDateString('fr-FR');
    const updatedLine = `Updated on ${currentDate}`;

    const content = Buffer.from(data.content, 'base64').toString('utf8');

    const lines = content
      .split('\n')
      .filter(line => !line.startsWith('Updated on '));
    lines.push(updatedLine);

    const finalContent = lines.join('\n');

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: readmePath,
      message: 'README.md updated automatically',
      content: Buffer.from(finalContent).toString('base64'),
      sha,
    });

    console.log('README.md updated automatically on GitHub');
  } catch (error) {
    console.error('An error occurred while updating on GitHub:', error);
  }
}

updateGitHubReadme();
