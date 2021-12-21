# pdf-category-reader
pdfjs, category reader, xmind


win 上不能用 marginNote， 做笔记又习惯了对比目录看内容。BookPro中生成目录不知道我不会用还是咋回事，目录重复生成直接把 xmind 卡死了，一直想有自己做 PDF 读取器的想法。

`node pdfjs-reader.js` 读取PDF中的目录

`node make-xmind.js` 根据生成的 test.txt （目录文件）生成 xmind 文件


缺点还是有的。pdfjs-dist 识别 pdf 时，内容并不是百分之百正确。还是需要人工手工校正的。不过还是比自己手敲快一点。

算是小实验啦

噢，打个小广告：[记录一次读取 PDF 目录的经历](https://i.cnblogs.com/posts/edit-done;postId=15715474)
