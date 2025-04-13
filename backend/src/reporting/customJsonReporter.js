const fs = require('fs');
const path = require('path');

class CustomJsonReporter {
  onRunComplete(_, results) {
    const testResults = results.testResults.map(file => ({
      
      file: file.testFilePath,
      status: file.numFailingTests > 0 ? 'failed' : 'passed',
      numPassing: file.numPassingTests,
      numFailing: file.numFailingTests,
      testResults: file.testResults.map(test => ({
        title: test.fullName,
        id: parseInt(test.fullName.match(/\[(\d+)\]/)?.[1] ?? '-1'),
        status: test.status,
        duration: test.duration
      }))
    }));

    const outputPath = path.join(__dirname, 'reports', 'results.json');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(testResults, null, 2));
  }
}

module.exports = CustomJsonReporter;
