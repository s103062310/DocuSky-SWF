# Tool Folder 說明

```diff
- 文件設定中若有使用到路徑者，位置請填寫以 DocuSky-SWF 為起始的「相對路徑」。
```

* ```tools/``` 底下，每個工具需有一個以其 id 命名的資料夾，用來記錄除基本資訊外的工具相關檔案，例如：操作指示、圖片等。
* ```tools/empty/``` 為範本資料夾。

## step.json
* 記錄工具以步驟為單位的操作說明。
* 檔名後綴為語言 id，標示不同的語言版本，e.g. step_zh.json, step_en.json。

### 資料格式
```json
{
    // 必填
    "oriTool": "在步驟提示框中，是否顯示到原工具的按鈕，true/false",
    "stepNum": "步驟數量",
    
    // 依需要選填
    "step1": {
        "text": "文字描述",
        "image": "圖片位置，若無請填寫 none",
        // 文字花樣可以粗體、斜體、強調，也可使用圖標，語法(html)請見以下範例
    },
    
    // step2
    // step3
    // ...
    // stepX (X=stepNum)
    // 每個步驟需有一包資料，以「stepX」命名，X 為由 1 開始到 stepNum 依序的編號
    
    // example
    "oriTool": true,
    "stepNum":4 ,   // X 從 1 到 4，需有 step1, step2, step3, step4 三項資料
    
   "step1": {
		"text": "這是完整的一個 step，包含文字描述與圖片。",
		"image": "tools/empty/0.png"
	},

	"step2": {
		"text": "也可以沒有圖片，但不能沒有文字。",
		"image": "none"
	},

	"step3": {
		"text": "文字部分<b>這樣可以粗體</b>，<em>這樣可以強調</em>，<i>這樣可以斜體</i>。如果想要兩種以上效果<b><i>就這樣</i></b>。",
		"image": "none"
	},

	"step4": {
		"text": "若想使用圖標可以這樣寫 <span class=\"glyphicon glyphicon-tags\"></span> ，class 內填寫需要的圖標名稱，可以從<a href=\"https://www.w3schools.com/bootstrap/bootstrap_ref_comp_glyphs.asp\">這裡</a>查到。",
		"image": "none"
	}
}
```
