import { execSync } from 'child_process';

const createAndCompletePR = () => {
  try {
    const createPRCommand = `az repos pr create --bypass-policy true --source-branch fe-npm-version --target-branch fe-develop --delete-source-branch true --title "[skip ci] Pull from fe-npm-version to fe-develop" --output json`;
    const prInfo = JSON.parse(execSync(createPRCommand).toString());

    const prId = prInfo.pullRequestId;

    const completePRCommand = `az repos pr update --status completed --id ${prId}`;
    execSync(completePRCommand);

    console.log('Pull Request created and completed successfully.');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

createAndCompletePR();
