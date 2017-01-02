#!/usr/bin/env node

/* eslint strict: "off" */

'use strict';

const _ = require('lodash');
const exec = require('child_process').exec;

/* eslint import/no-extraneous-dependencies: "off" */
const CLIEngine = require('eslint').CLIEngine;

const cli = new CLIEngine({
  configFile: '.eslintrc',
});

exec('git diff --cached --name-only --diff-filter=ACM', (error, stdout) => {
  if (error !== null) {
    throw error;
  }

  const files = _(stdout.split('\n')).filter(file => _.endsWith(file, '.js') || _.endsWith(file, '.jsx')).value();

  if (files.length === 0) {
    process.exit(0);
  }

  const getEslintReport = () => new Promise((resolve, reject) => {
    const report = cli.executeOnFiles(files);
    const formatter = cli.getFormatter();
    const errorReport = CLIEngine.getErrorResults(report.results);

    if (errorReport.length > 0) {
      reject(formatter(report.results));
    } else {
      resolve([]);
    }
  });

  return getEslintReport()
    /* eslint no-console: "off" */
    .then(() => console.log('COMMIT SUCCEEDED\n'))
    .catch((errors) => {
      console.log(errors);
      console.log('COMMIT FAILED: Your commit contains files that do not pass lint tests. Please fix the errors and try again.\n');

      process.exit(1);
    });
});
