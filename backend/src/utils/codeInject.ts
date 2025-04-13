import path from 'path';
import fs from 'fs/promises';

 const injectReporter = async (targetRepoPath: string) => {
  const reporterSrc = path.join(__dirname, '../reporting/customJsonReporter.js');
  const configDest = path.join(targetRepoPath, 'jest.config.js');
  const reporterDest = path.join(targetRepoPath, 'customJsonReporter.js');

  // Copy reporter
  const reporterCode = await fs.readFile(reporterSrc, 'utf-8');
  await fs.writeFile(reporterDest, reporterCode);

  // Inject config
  const configCode = `
    module.exports = {
      reporters: [
        "default",
        "./customJsonReporter.js"
      ]
    };
  `;
  await fs.writeFile(configDest, configCode);
};

export default injectReporter;