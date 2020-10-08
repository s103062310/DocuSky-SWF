# DocuSky-SWF
[Develop Weekly Progress](https://hackmd.io/@DocuSky/S1EY0FTJP)

> 2020.07.20 | v.0.1, prototype  
> 2020.07.24 | v.1.0  
> 2020.09.16 | v.2.0  
> 2020.10.08 | v.2.1, fix: adjustment

## Directory

```
DocuSky-SWF/
  └ selector.html   (flow selector)
  └ swf.html        (work flow UI structure)
  └ assets/         (materials for main tool - selector & swf)
      └ js/
      └ css/
      └ json/
      └ fonts/
      └ images/
  └ tools/          (all tools files)
      └ empty/          (template/example)
          └ step_zh.json   (required, tool steps file in chinese)
          └ step_en.json   (optional, tool steps file in other language, if language is set in language.json)
          └ .
          └ .
          └ .
          └ (also can put tool related images)
      └   .             (each folder records information of a tool)
      └   .
      └   .
```

## Main Files for SWF

### HTML
(only contain html UI structure, no content)
* **selector.html:** before entering work flow page, select a flow according to given I/O
* **swf.html:** main work flow page

### JS (assets/js/)
* **globalVar.js:** common global variables and window initialze functions of selector and work flow page, make sure all data is loaded.
* **selector.js:** functions for selector.html
* **toolMap.js:** functions related to svg tool map (show in selector.html)
* **swf.js:** functions for swf.html

### CSS (assets/css/)
* **main-style.css:** style sheet for overall UI setting and header
* **selector-style.css:** style sheet for selector.html
* **swf-style.css:** style sheet for swf.html
* **swf-content-style.css:** style sheet for detailed UI of swf.html such as overview and steps

### JSON (assets/json/)
(click [here](https://github.com/s103062310/DocuSky-SWF/tree/master/assets/json/readme.md) to look for more details for format in each json files (written in Chinese).)
* **language.json:** language choice array
* **tools.json:** record information of all tools
* **id2text.json:** record corresponding text of each id
* **selector.json:** record text used in selector.html
* **swf.json:** record text used in swf.html

## Tool folder (tools/.../)
* Each folder under ```tools/``` represents a tool, and the folder name must be the ID of the tool defined in ```assets/json/tools.json```.
* Each tool folder **must** contain **step_zh.json**, record step by step instructions of the tool in Chinese
* Filename of step by step instructions in other language needs to be **step_xx.json**, where *xx* is language id defined in ```assets/json/language.json```.
* Click [here](https://github.com/s103062310/DocuSky-SWF/tree/master/tools/empty/readme.md) for more details for format in **step.json** (written in Chinese).
* Under tool folder, all images related to the tool also can be put here. Just remember to write the path correctly in other files.
