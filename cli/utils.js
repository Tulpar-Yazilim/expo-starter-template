#!/usr/bin/env node
const { exec } = require('child_process');
const { consola } = require('consola');

const UPSTREAM_REPOSITORY = "obytes/react-native-template-obytes";
const TEMPLATE_REPOSITORY = "Tulpar-Yazilim/expo-starter-template";

const execShellCommand = (cmd) => {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
        reject(error);
      }
      resolve(stdout || stderr);
    });
  });
};

const runCommand = async (
  command,
  { loading = 'loading ....', success = 'success', error = 'error' }
) => {
  consola.start(loading);
  try {
    await execShellCommand(command);
    consola.success(success);
  } catch (err) {
    consola.error(`Failed to execute ${command}`, err);
    process.exit(1);
  }
};
// show more details message using chalk
const showMoreDetails = (projectName) => {
  consola.box(
    'Your project is ready to go! \n\n\n',
    '🚀 To get started, run the following commands: \n\n',
    `   \`cd ${projectName}\` \n`,
    '   iOS     :  `yarn ios` \n',
    '   Android :  `yarn android` \n\n',
    '📚 Template Documentation: https://tulpar-yazilim.github.io/expo-starter-template'
  );
};

module.exports = {
  runCommand,
  showMoreDetails,
  execShellCommand,
  UPSTREAM_REPOSITORY,
  TEMPLATE_REPOSITORY,
};
