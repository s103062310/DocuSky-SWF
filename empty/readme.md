# 建立一條新的 Work Flow

1. 在 DocuSky-SWF 下創建一個新的資料夾，資料夾名稱即為 「simple work flow 代碼」
2. work flow 資料夾下必須創建兩個資料夾：
	* **images/** --> 存放此條 work flow 的所有圖片
	* **json/** --> 存放此條 work flow 的所有 json 檔案
3. 在 json/ 下，必須創建 **basic.json** 的檔案，用來記錄此條 work flow 的概況
4. 在 json/ 下，必須創建 **language.json** 的檔案，用來記錄此條 work flow 的語言版本
5. 依照每條 flow 的階段數，創建相應數量的 .json 檔，紀錄每個階段的步驟說明

> * 範例見 empty/ 資料夾
> * 使用方式：網址列需加上變數，index.html?swf=empty，swf 填寫「simple work flow 代碼」，即資料夾名稱
> * console 的錯誤若是嵌入的網站可以不用理他，處理請找嵌入網站的負責人
> * 若網頁無法正確顯示，請先檢查 json 檔格式是否有誤
> * json 資料除了數字外，全部都需要以雙引號包起來
> * json 檔內不可以有註解

## language.json
* 目前支援語言：繁體中文、英文
* 預設讀取**中文**檔案
* 以檔名後綴來區分不同語言的檔案，eg. basic_xx.json

## 資料格式
``` json
{
	"語言代碼 1": ["語言 1", "語言 2", "語言 3", ...],  // 陣列內容使用 語言 1
	"語言代碼 2": ["語言 1", "語言 2", "語言 3", ...],  // 陣列內容使用 語言 2
	(以下以此類推)
	......
	...
}
```

## 語言代碼
語言 | 代碼
-----|----
中文 | zh
英文 | en

## basic.json

### 必填欄位
1. title: work flow 名稱
2. intro: work flow 簡介
3. stageNum: 此條 work flow 的階段有幾個? (需經過的工具數量)

### 階段 (Stage) 資料
* 每個階段需有一包資料，以­「stageX」命名，X 為由 1 開始依序的編號，例如：stageNum 為 3，則 X 從 1 到 3，需有 stage1, stage2, stage3 三項資料
* 每個階段的資料與格式須包含以下各項目：
	1. name: 階段的標題
	2. id: 為此階段取一個在此條 flow 中「唯一」的辨識碼，使用半形英數字，取名盡量有其字面上的意義
	3. url: 工具的網址/位置
	4. step: 描述此階段步驟的 json 檔位置
	5. image: 流程圖的階段縮圖的位置
	6. description: 此區填寫流程圖的階段描述
	7. arrow: 流程圖箭頭，right 為加向右箭頭，none 不加  --->  須配合程式調整
* 位置請填寫以 DocuSky-SWF 為起始的「相對路徑」

## step.json

### 必填欄位
1. title: X. 第 X 階段標題
2. oriTool: 是否顯示回到原工具的按鈕
3. stepNum: 此階段的步驟數量

### 步驟 (Step) 資料
* 每個步驟需有一包資料，以­「stepX」命名，X 為由 1 開始依序的編號，例如：stepNum 為 3，則 X 從 1 到 3，需有 step1, step2, step3 三項資料
* 每個步驟的資料與格式包含以下各項目：
	1. text: 必填，文字描述
	2. image: 選填，圖片位置
* 文字花樣可以粗體、斜體、強調，也可使用圖標，語法請見範例 (empty/json/id-step.json)