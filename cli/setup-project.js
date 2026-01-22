const {
  execShellCommand,
  runCommand,
} = require('./utils.js');
const path = require('path');
const { consola } = require('consola');
const fs = require('fs-extra');
const ProjectFilesManager = require('./project-files-manager.js');

/**
 * @type {ProjectFilesManager}
 */
let projectFilesManager;

const initializeProjectRepository = async (projectName) => {
  await execShellCommand(`cd ${projectName} && git init && cd ..`);
};

const installDependencies = async (projectName) => {
  const projectRoot = path.resolve(process.cwd(), projectName);
  const packageJsonPath = path.join(projectRoot, 'package.json');

  const packageJson = fs.readJsonSync(packageJsonPath);
  const hasPackageManager = !!packageJson.packageManager;

  const installCommand = hasPackageManager
    ? `cd ${projectName} && corepack enable && corepack install`
    : `cd ${projectName} && yarn install`;

  await runCommand(installCommand, {
    loading: 'Installing project dependencies',
    success: 'Dependencies installed',
    error:
      'Failed to install dependencies. Make sure Corepack is enabled (corepack enable)',
  });
};

const removeUnrelatedFiles = () => {
  projectFilesManager.removeFiles([
    '.git',
    'README.md',
    'docs',
    'cli',
    'LICENSE',
  ]);
};

// Update package.json infos, name and set version to 0.0.1 + add initial version to rsMetadata
const updatePackageJson = async (projectName) => {
  const packageJsonPath =
    projectFilesManager.getAbsoluteFilePath('package.json');

  const packageJson = fs.readJsonSync(packageJsonPath);
  packageJson.rsMetadata = { templateVersion: packageJson.version };
  packageJson.version = '0.0.1';
  packageJson.name = projectName?.toLowerCase();
  packageJson.repository = {
    type: 'git',
    url: 'git+https://github.com/user/repo-name.git',
  };

  const appReleaseScript = packageJson.scripts['app-release'];
  packageJson.scripts['app-release'] = appReleaseScript.replace(
    'template',
    projectName,
  );
  fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });
};

const updateProjectConfig = async (projectName) => {
  projectFilesManager.replaceFilesContent([
    {
      fileName: 'env.js',
      replacements: [
        {
          searchValue: /ExpoApp/gi,
          replaceValue: projectName,
        },
        {
          searchValue: /com.expoapp/gi,
          replaceValue: `com.${projectName.toLowerCase()}`,
        },
        {
          searchValue: /rsdevs/gi,
          replaceValue: 'expo-owner',
        },
      ],
    },
    {
      fileName: 'app.config.ts',
      replacements: [
        {
          searchValue: "slug: 'reactnativetemplate'",
          replaceValue: `slug: '${projectName.toLowerCase()}'`,
        },
      ],
    },
  ]);
};

const updateProjectReadme = (projectName) => {
  projectFilesManager.renameFiles([
    {
      oldFileName: 'README-project.md',
      newFileName: 'README.md',
    },
  ]);

  projectFilesManager.replaceFilesContent([
    {
      fileName: 'README.md',
      replacements: [
        {
          searchValue: 'Mobile App',
          replaceValue: projectName,
        },
      ],
    },
  ]);
};

const setupProject = async (projectName) => {
  consola.start(`Clean up and setup your project 🧹`);

  const projectRoot = path.resolve(process.cwd(), projectName);
  projectFilesManager = ProjectFilesManager.withProjectRoot(projectRoot);

  try {
    removeUnrelatedFiles();
    await initializeProjectRepository(projectName);
    updatePackageJson(projectName);
    updateProjectConfig(projectName);
    updateProjectReadme(projectName);
    consola.success(`Clean up and setup your project 🧹`);
  } catch (error) {
    consola.error(`Failed to clean up project folder`, error);
    process.exit(1);
  }
};

module.exports = {
  setupProject,
  installDependencies,
};
