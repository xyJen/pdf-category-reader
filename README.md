# pdf-category-reader
pdfjs, category reader, xmind


### 2021-12-23

加了个 cli，仅支持本级目录下识别

本地 `yarn link` 把 cli 命令挂在全局


`pdf-reader txt pdfName` 识别PDF中的大纲，以大纲作为目录

也提供高级模式，`pdf-reader -f pdfName -p startPage-endPage` 按 PDF 的页数识别目录。但是识别率太随缘了，应该再叠加一层 OCR，懒得搞了，花了两天时间了，有点浪费，本来是想着看看书来着的啊摔(╯‵□′)╯︵┻━┻

### 2021-12-22

win 上不能用 marginNote， 做笔记又习惯了对比目录看内容。BookPro中生成目录不知道我不会用还是咋回事，目录重复生成，能直接把 xmind 卡死了，一直想有自己做 PDF 读取器的想法。

`node pdfjs-reader.js` 读取PDF中的目录

`node make-xmind.js` 根据生成的 test.txt （目录文件）生成 xmind 文件


缺点还是有的。pdfjs-dist 识别 pdf 时，内容并不是百分之百正确。还是需要人工手工校正的。不过还是比自己手敲快一点。

算是小实验啦

噢，打个小广告：[记录一次读取 PDF 目录的经历](https://i.cnblogs.com/posts/edit-done;postId=15715474)
