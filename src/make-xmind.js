const { Workbook, Topic, Zipper } = require('xmind');
const fs = require('fs');
const chalk = require('chalk');

function readFile(readPath) {
  const data = fs.readFileSync(readPath, { encoding: 'utf-8' });
  const item = data.split('\n');
  return item;
}

function isFirstLevelDirectory(stringValue) {
  if (stringValue[0] === '第' || /^(\d+)\s?[\u4e00-\u9fa5A-Za-z]+/.test(stringValue)) return true;
  return false;
}
function isSecondLevelDirectory(stringValue) {
  if (/^(\d+.\d)\s?[\u4e00-\u9fa5A-Za-z]+/.test(stringValue)) return true;
  return false;
}

function checkTargetPath(path) {
  if (fs.existsSync(path)) return;

  const fileLevelList = path.split('/');

  if (fileLevelList.length > 3) { //  只支持这种 ./XXXXX 写法，再多写就报错了。懒得做完美了，好累
    chalk.red('仅支持指定一层目录噢');
    return;
  }

  fs.mkdirSync(path);
}

function createXmind({ filePath, topicName, filename, targetPath='./tmp' }) {
  const data = readFile(filePath);

  checkTargetPath(targetPath);
  
  const wb = new Workbook();
  const topic = new Topic({sheet: wb.createSheet('sheet-1', topicName)});
  const zip = new Zipper({path: targetPath, workbook: wb, filename});
  
  const items = data;
  let currentFirstLevelDir = '';
  let currentSecondeLevelDir = '';
  items.forEach(item => {
    if (isFirstLevelDirectory(item)) {
      currentFirstLevelDir = item;
      topic.on().add({ title: item });
    } else if (isSecondLevelDirectory(item)) {
      currentSecondeLevelDir = item;
      topic.on(topic.cid(currentFirstLevelDir)).add({ title: item });
    } else {
      topic.on(topic.cid(currentSecondeLevelDir)).add({ title: item });
    }
  });
  
  zip.save().then(status => status && console.log('Saved.'));
}

// createXmind({
//   filePath: 'node-cplus.txt',
//   topicName: 'Node.js:来一打C++扩展',
//   filename: 'Node.js:来一打C++扩展.xmind',
//   targetPath: './tmp'
// })

module.exports = createXmind;
