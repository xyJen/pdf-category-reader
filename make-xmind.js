const { Workbook, Topic, Zipper } = require('xmind');
const fs = require('fs');

function readFile() {
  const data = fs.readFileSync('./test.txt', { encoding: 'utf-8' });
  const item = data.split('\n');
  return item;
}

function isFirstLevelDirectory(stringValue) {
  if (stringValue[0] === '第') return true;
  return false;
}
function isSecondLevelDirectory(stringValue) {
  if (/^\d\.\d[\u4e00-\u9fa5]+/.test(stringValue)) return true;
  return false;
}

function createXmind(data, { topicName, filename, targetPath}) {
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

const data = readFile('test.txt');
createXmind(data, {
  topicName: 'Web渗透实战',
  filename: 'test.xmind',
  targetPath: './tmp'
})
