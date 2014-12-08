HADOUKEN 
===========
HADOUKEN是一個用nodejs寫的批處理工具，用於把dayone的日誌處理成html。用於分享或部署到github靜態部落格中。
項目名HADOUKEN（波動拳）源於街霸裏Ryu（隆）必殺技。Ryu是我玩街霸時最愛用的角色。


使用方式
------------
git回來，先修改run.js裏的DIR_ENTRIES為你自己的dayone日誌目錄，然後切到終端：
```
node install
node run.js
```
即可生成dayone日誌索引以日誌正文。

下一個版本預計添加
------------
自動複製附件到attachement。
自動詢問git更新。


版本日誌
------------
v0.4 話說明天要上班了，這個是帶tag頁的可用版本，一切都很好：）

v0.3 加入markdown解析器，加入縮略圖，加入tag抓取（下一版本開放）。

v0.2 熬夜修了一下bug，現在可用了，但圖片輸出有問題，而且全是用console輸出拼接的index.html。誒，nodejs實在苦手。

v0.1 超級差的，居然還有BUG，而且用都不能用，我就git上來了，本著git上來也是為了散佈一下讓大家幫一下我，僅此而已。
