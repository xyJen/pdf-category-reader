const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");
const fs = require('fs');
const createXmind = require('./make-xmind.js');

const getReadPageRange = (pageValue) => {
  let valid = false;
  let pageList = pageValue.split('-');
  try {
    valid = pageList.every(page => {
      try {
        const num = parseInt(page);
        return num > 0;
      } catch (error) {
        return false;
      }
    })
  } catch (error) {
    valid = false;
  }

  if (!valid) {
    return [];
  }
  return pageList;
}

const dataCleaner = (stringValue) => {
  // remove blank
  stringValue = stringValue.replaceAll(/\\s*/g, '');
  stringValue = stringValue.replaceAll(' ', '');
  stringValue = stringValue.replaceAll('’', '');
  stringValue = stringValue.replaceAll('，', '');
  stringValue = stringValue.replaceAll('．', '');
  stringValue = stringValue.replaceAll('＋', '+');
  stringValue = stringValue.replaceAll('（', '(');
  stringValue = stringValue.replaceAll('）', ')');
  stringValue = stringValue.replaceAll('一', '-');
  stringValue = stringValue.replaceAll('－', '-');
  // 字符匹配
  stringValue = stringValue.replaceAll('内直', '内置');
  stringValue = stringValue.replaceAll('封苯', '封装');
  stringValue = stringValue.replaceAll('配直', '配置');
  // remove ·
  stringValue = stringValue.replaceAll(/·+/g, '');
  stringValue = stringValue.replace(/^[.]/, '');
  // remove ...
  stringValue = stringValue.replaceAll(/\.{2,}/g, '');
  return stringValue;
};
const checkValid = (stringValue) => {
  let isEmpty = stringValue === '';
  let isNumber = /^[0-9]\d*$/.test(stringValue);
  // let isDot = stringValue == '.'

  return !isEmpty && !isNumber;
};

const loadPage = async function (docInstance,pageNum) {
  let pageInstance = await docInstance.getPage(pageNum);
  let contentInstance = await pageInstance.getTextContent({
    disableCombineTextItems: true,
    normalizeWhitespace: true,
  });

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

const normalizeOutlines = (outlines) => {
  let res = [];

  const loop = (outline) => {
    res.push(outline.title);
    if (Array.isArray(outline.items) && outline.items.length > 0) {
      outline.items.forEach(item => loop(item));
    }
  }

  outlines.forEach(outline => loop(outline));

  return res;
}

const reader = async function (params) {
  const { pdfPath, page } = params;
  const data = new Uint8Array(fs.readFileSync(pdfPath));

  const loadingTask = pdfjsLib.getDocument({
    data,
    cMapUrl: './node_modules/pdfjs-dist/cmaps/',
    standardFontDataUrl: './node_modules/pdfjs-dist/standard_fonts/',
    cMapPacked: true
  });
  const doc = await loadingTask.promise;


  let textName = pdfPath.substring(0, pdfPath.lastIndexOf('.'));
  if (page === undefined) { // 如果没有 page, 则认为是 简单模式
    const outlines = await doc.getOutline();
    const bookMarks = normalizeOutlines(outlines);
    const pageContent = bookMarks.join('\n');
  
    fs.appendFileSync(`${textName}.txt`, pageContent);
  } else {
    // 高级模式，根据 page 读取内容
    const [startPage, endPage] = getReadPageRange(page);
    if (!startPage || !endPage) {
      console.log('页码只接收数字');
      return;
    }
  
    for (let i = startPage; i <= endPage; i++) {
      const pageContent = await loadPage(doc, i);
      fs.appendFileSync(`${textName}.txt`, pageContent);
    }
  }

  createXmind({
    filePath: `${textName}.txt`,
    topicName: textName,
    filename: `${textName}.xmind`,
    targetPath: params.output || './tmp'
  });

}

module.exports = reader;