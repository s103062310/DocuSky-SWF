# SWF JSON 資料格式說明

```diff
- 文件設定中若有使用到路徑者，位置請填寫以 SimpleWorkFlow 為起始的「相對路徑」。
```

## 基本條目
```js
{
    "項目A id": {
        "語言a id": "項目 A 以語言 a 書寫的資料",
        "語言b id": "項目 A 以語言 b 書寫的資料"
    }, //  以此類推 ...
    
    // example
    "id-01": {
        "zh": "id-01 的中文資料",
        "en": "English Data of id-01",
        "xx": "id-01 的其它語言資料"
    },
    
    // 依需求繼續照格式編寫
}
```

## language.json
* 記錄可切換的語言種類。
* 定義工具使用語言的 id。

### 資料格式
```js
{
    "語言a id": "語言 a 的文字",
    "語言b id": "語言 b 的文字",
    // 以此類推 ...
    
    // example (現行設定)
    "zh": "中文",
    "en": "English"
}
```

## tools.json
* 記錄所有工具的資訊。
* 使用 id 進行各項設定，id 包括：
  * **tool:** 工具。
  * **input:** SWF 的輸入，使用者持有之文本格式。
  * **output:** SWF 的輸出，使用者欲達成之目的。
  * **material:** 使用每項工具時，除文本外，使用者需額外準備的材料。
  * **func:** 以單詞簡述每項工具的功能 (描述流程時使用)。

### 資料格式
```js
{
    "工具 id": {
        "func": "工具功能單詞簡述",
        "input": [ "輸入 id-01", "輸入 id-02", "..." ],     // 工具輸入(文本格式)的陣列 
        "output": [ "輸出 id-01", "輸出 id-02", "..." ],    // 工具輸出(目的)的陣列
        "material": [ "材料 id-01", "材料 id-02", "..." ],  // 工具需額外準備的材料陣列
        "next": [ "工具 id-01", "工具 id-02", "..." ],      // 可接續使用工具的陣列
        "pos": [ "x", "y" ],                               // 工具點在地圖中的座標
        
        "info": {
        
            // 用語言 a 撰寫的工具資訊
            "語言a id": {
                "toolname": "工具名稱",
                "url": "工具網址",
                "image": "工具縮圖",
                "description": "工具簡短描述"
            },
            
            // 用語言 b 撰寫的工具資訊
            "語言b id": {
                // 欄位相同，以此類推
            },
            
            // ...
        }
    }, // 以此類推 ...

    // example
    "ct": {
        "func": "tagging",
        "input": [ "xml" ],
        "output": [],
        "material": [ "taglist" ],
        "next": [ "manage", "builddb" ],
        "pos": [145, 125],

        "info": {

            "zh": {
                "toolname": "批次標記工具",
                "url": "http://docusky.org.tw/DocuSky/docuTools/ContentTaggingTool/index.html",
                "image": "tools/empty/0.png",
                "description": "批次的將紀錄於表格中 (.xls, .xlsx) 的詞彙，在 DocuXml 格式的文本中進行搜尋與標記。"
            }

        }
    },
}
```

## id2text.json
* 在 ```tools.json``` 中使用 id 的方式進行每項工具的設定，使用此檔案將 id 轉成統一的文字。
* id 分成四大類：input, output, material, func。

### 資料格式
```js
{
    "id 類別": {
        // 基本條目 1
        // 基本條目 2
        // ...
    },
    
    // example
    "input": {
    
        "txt": {
            "zh": "純文字文本 (.txt)",
            "en": "Plain Text Data (.txt)"
        },
        
        "excel": {
            "zh": "表格文本 (.csv, .xlsx)",
            "en": "Table Data (.csv, .xlsx)"
        },
        
        // ...
        
    }
}
```

## selector.json & swf.json
* 紀錄所有相應的 html 中會出現的文字。
* 由多個 **基本條目** 組合而成。
* 以一個條目為單位，替每筆資料製作多語言內容。

### 資料格式
```js
{
    // 基本條目 1
    // 基本條目 2
    // ...
}
```

## 新增一項工具
1. 在 ```assets/json/tools.json``` 中新增一項工具的資料 (詳見 [上述設定](#toolsjson))。
2. 若途中有新的 id 產生，將其對應的文字添加到 ```assets/json/id2text.json``` 中 (詳見 [上述設定](#id2textjson))。
3. ```pos``` 的欄位先隨便填一個座標。
4. 打開 ```assets/js/selector.js```，將 ```function toTool()``` 的 ```window.open(_tools[$toolID].info[_language].url)``` 註解掉。
5. 打開 ```selector.html```，捲動到頁面下方的工具地圖，拖動新增的工具點到適合的位置。
6. 打開瀏覽器 console，呼叫 ```outputNode()```。
7. 查看打印出來的工具點座標，更新新增工具在 ```assets/json/tools.json``` 的座標。
8. 查看一切正常後，回到 ```assets/js/selector.js``` 取消第四步的註解。
9. 在 ```tools/``` 下創建新增工具的資料夾，並放入所需檔案 (詳見 [相關設定](https://github.com/s103062310/DocuSky-SWF/tree/master/tools/empty/readme.md))。

## 新增一種語言
1. 打開 ```assets/json/language.json```，新增語言 (詳見 [上述設定](#languagejson))。
2. 打開 ```assets/``` 之下 **所有** json 檔，依照各檔案規定格式添加新增的語言翻譯。
3. ```tools/``` 之下，每個工具資料夾內皆添加一個新增語言的 step.json 檔案 (詳見 [相關設定](https://github.com/s103062310/DocuSky-SWF/tree/master/tools/empty/readme.md))。