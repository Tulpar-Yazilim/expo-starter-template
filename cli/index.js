#!/usr/bin/env node

const { consola } = require('consola');
const { showMoreDetails } = require('./utils.js');
const { cloneLatestTemplateRelease } = require('./clone-repo.js');
const { setupProject, installDependencies } = require('./setup-project.js');
const pkg = require('./package.json');

const [major] = process.versions.node.split('.').map(Number);
if (major < 18) {
  consola.error('Node.js 18 or higher is required.');
  process.exit(1);
}

const { name: packageName } = pkg;

const createApp = async () => {
  consola.box('Expo Starter Template\nPerfect React Native App Kickstart 🚀!');

  const projectName = process.argv[2];

  if (!projectName) {
    consola.error(
      `Please provide a project name:\n\n` +
        `npm create tp-expo-starter <project-name>\n` +
        `or\n` +
        `npx create-tp-expo-starter <project-name>`,
    );
    process.exit(1);
  }

  await cloneLatestTemplateRelease(projectName);
  await setupProject(projectName);
  await installDependencies(projectName);
  showMoreDetails(projectName);
};

createApp().catch((err) => {
  consola.error(err.message || err);
  process.exit(1);
});
