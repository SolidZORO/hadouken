HADOUKEN
===========
HADOUKEN是一個用nodejs寫的[dayone](href=http://dayoneapp.com)日誌轉換工具，用於把dayone的日誌處理成html。

> 項目名HADOUKEN，中文翻譯為「波動拳」，源於街霸裏Ryu（隆）的必殺技。


初衷
------------
老實說，dayone的使用體驗很好，客戶端也是除Windows之外都有部署，在上面鍵入文字非常有感覺，作者應該是想把dayone做成一個足夠好、好到足夠把你的「日誌」數碼化的工具。

但也正因如此，日誌其實是一個很個人的東西，所以dayone上不大可能見到有「發佈到網絡」、「分享到微博」這樣的功能。那⋯⋯既然官方沒有給予支持，那我就來做做看好了，正好最近有學習Javascript的念頭。

所以，HADOUKEN的初衷很簡單，就是為了打破dayone限制，讓其能夠HTML化、部署到部落格上的工具。

[要看Demo可以點這裏](http://solidzoro.com) 。


還搞不明白HADOUKEN為何物？沒關係，見下圖。
![HADOUKEN](https://raw.githubusercontent.com/SolidZORO/HADOUKEN/master/HADOUKEN.jpg)

btw：Ryu是我玩街霸時最愛用的角色，因此HADOUKEN的默認主題名也取叫Ryu。與此同時，在主題目錄下還有另外一個空目錄，它叫做「Ken」。（笑）




使用方式
------------
* git clone回來。
* 修改run.js裏的CONFIG。
* 切到終端：

```
npm install
node run.js
```

便會得到生成的dayone日誌索引以日誌正文html。



下一個版本預計添加
------------
* ~~自動一鍵生成git更新。~~
* ~~dayone for iOS 現版本新加入了運動和收藏，如果選了，json會不對，有時間了要debug一下。~~


版本日誌
------------
v0.8 2014-12-12 01:19
* 加入隱私日誌功能，只需在tag寫入「秘密」即不會生成html


v0.7 2014-12-11 12:19
* 修復dayone加入狀態數據時的錯位

v0.6 2014-12-10 20:19
* 加入分頁功能

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
