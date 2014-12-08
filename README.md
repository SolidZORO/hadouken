HADOUKEN
===========
HADOUKEN這是一個用nodejs寫的[dayone](href="dayoneapp.com" target="_blank")日誌轉換工具，用於把dayone的日誌處理成html。

項目名HADOUKEN，中文翻譯為「波動拳」，源於街霸裏Ryu（隆）的必殺技，Ryu是我玩街霸時最愛用的角色。

還搞不明白？沒關係，見下圖。
![HADOUKEN](https://raw.githubusercontent.com/SolidZORO/HADOUKEN/master/HADOUKEN.jpg)




使用方式
------------
git clone回來，先修改run.js裏的DIR_ENTRIES為你的dayone日誌目錄，然後切到終端：

```
node install
node run.js
```

生成dayone日誌索引以日誌正文。



下一個版本預計添加
------------
* 自動一鍵生成git更新。


版本日誌
------------
v0.5 2014-12-08 17:20

* 首頁文章截斷（不再顯示超長了）
* 自動清空，拷貝，刪除文件夾（本來想做個附件實時對比的，感覺又沒太大必要）

v0.4 2014-12-08 00:35

* 加入默認主題
* 這個是帶tag頁的可用版本
* 話說明天要上班了，感覺一切都很好：）


v0.3 2014-12-03 00:21

* 加入markdown解析器
* 加入縮略圖
* 加入tag抓取（下一版本開放）。


v0.2 2014-11-30 05:29

* 熬夜修了一下bug，現在可用了，但圖片輸出有問題，而且全是用console輸出拼接的index.html。誒，nodejs實在苦手。


v0.1 2014-11-29 13:01

* 超級差的，居然還有BUG，而且用都不能用，我就git上來了，本著git上來也是為了散佈一下讓大家幫一下我，僅此而已。
