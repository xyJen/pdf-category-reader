const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");
const fs = require('fs');

const pdfPath =
  process.argv[2] || "seep.pdf";

const dataCleaner = (stringValue) => {
  // remove blank
  stringValue = stringValue.replaceAll(/\\s*/g, '');
  stringValue = stringValue.replaceAll(' ', '');
  stringValue = stringValue.replaceAll('’', '');
  stringValue = stringValue.replaceAll('，', '');
  // remove ·
  stringValue = stringValue.replaceAll(/·+/g, '');
  stringValue = stringValue.replace(/^[\.]/, '');
  // remove ...
  stringValue = stringValue.replaceAll(/\.{2,}/g, '');
  return stringValue;
};
const checkValid = (stringValue) => {
  let isEmpty = stringValue === '';
  let isNumber = /^[0-9]\d*$/.test(stringValue);
  let isDot = stringValue == '.'

  return !isEmpty && !isNumber;
};

const loadPage = async function (docInstance,pageNum) {
  let pageInstance = await docInstance.getPage(pageNum);
  let contentInstance = await pageInstance.getTextContent();

  let strings = contentInstance.items.map(item => {
    return dataCleaner(item.str);
  }).filter(item => (checkValid(item)))
    .map(item => {
      if (item.indexOf('.') > 0) {
        return `\n${item}`;
      }
      return item;
    });
  
  let pageContent = strings.join('');
  pageInstance.cleanup();

  return pageContent;
};

const reader = async function (pdfPath) {
  const loadingTask = pdfjsLib.getDocument(pdfPath);

  const doc = await loadingTask.promise;
  const numPages = doc.numPages;

  for (let i = 2; i <= 12; i++) {
    const pageContent = await loadPage(doc, i);
    fs.appendFileSync('test.txt', pageContent);
  }
}

reader(pdfPath).then(function (data) {
  console.log('data: ', data);
})