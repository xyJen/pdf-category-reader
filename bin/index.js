#!/usr/bin/env node

const chalk = require('chalk');
const fs = require('fs');
const { Command } = require('commander');
const program = new Command();
const log = console.log;

program
  .option('-f, --file <file>', 'read target pdf file')
  .option('-p, --page <page>', 'read pdf page range')
  .option('-o, --output <path>', 'xmind output path')
  .option('-d, --debug', 'remain development resources')
  .action((options) => {
    let pdfPath = options.file;
    if (!pdfPath || !fs.existsSync(pdfPath)) {
      log(chalk.red('传入一个可以读取的PDF啊亲'));
      return;
    }

    require('../src/pdfjs-reader.js')({
      pdfPath,
      page: options.page,
      output: options.output
    })
  });

program.parse();
