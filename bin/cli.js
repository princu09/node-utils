#!/usr/bin/env node
const { execSync } = require("child_process");

const runCommand = (command) => {
  try {
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.log("Failed to run command " + command + " " + error);
    return false;
  }
  return true;
};

const repoName = "node-utils"; // Set your package name here

console.log(`Installing Package "${repoName}"...`);

// Clone the repository and remove the .git folder
const gitCheckoutCommand = `git clone --depth 1 https://github.com/princu09/${repoName}.git ${repoName} && rm -rf ${repoName}/.git`;
const gitCheckout = runCommand(gitCheckoutCommand);

if (!gitCheckout) {
  console.log("Git checkout failed");
  process.exit(1);
}

console.log(`Installing dependencies for "${repoName}"...`);

// Install dependencies in the cloned repository
const installDependenciesCommand = `cd ${repoName} && npm install`;
const installDependencies = runCommand(installDependenciesCommand);

if (!installDependencies) {
  console.log("Installing dependencies failed");
  process.exit(1);
}

console.log("\nNote: Change the package name in the package.json and package-lock.json file");
console.log("\nCongrats! Your package is ready! 🚀");

// Remove the .github folder
const removeGitHubFolderCommand = `rm -rf ${repoName}/.github`;
const removeGitHubFolder = runCommand(removeGitHubFolderCommand);

if (!removeGitHubFolder) {
  console.log("Failed to remove the .github folder");
  process.exit(1);
}

// Remove the .git repository
const removeGitRepoCommand = `rm -rf ${repoName}/.git`;
const removeGitRepo = runCommand(removeGitRepoCommand);

if (!removeGitRepo) {
  console.log("Failed to remove the .git repository");
  process.exit(1);
}

console.log(`\nTo get started, navigate to the "${repoName}" directory and run your package's commands.`);
