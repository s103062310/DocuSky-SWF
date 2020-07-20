# DocuSky-SWF
[Develop Weekly Progress](https://hackmd.io/gJHTSj54S-KSJKVBvLS4XQ)

> 2020.07.20 | v.0.1, prototype  
> 2020.07.24 | v.1.0 

## Directory

```
DocuSky-SWF/
  └ index.html      (common parts for every flow - UI structure)
  └ assets/         (materials for index.html)
      └ js/
      └ css/
      └ fonts/
      └ images/
  └ empty/          (template/example)
      └ json/
      └ images/
      └ readme.md   (how to create a new flow and files detailed format - write in Chinese)
  └   .             (each folder is a flow with folder name as flow code)
  └   .
  └   .
```

## Files

### main
* **index.html:** only contain html structure, no content
* **assets/js/main.js:** clicked events, display functions
* **assets/css/main-style.css:** style sheet for main UI of flow such as tool bar
* **assets/css/exp-style.css:** style sheet for detailed UI such as overview and steps

### flow folder > json/
* **basic_zh.json (must):** record basic information about the flow
* **other_zh.json (must):** at least 2 files, depended on how many stages the flow has
* **basic_en.json (optional):** same as basic_zh.json, just write in English (for other language, change **en** to other language code)
* **other_en.json (optional):** same as other_zh.json, just write in English (for other language, change **en** to other language code)

### Work Flows
1. **empty:** templated example
2. **multiread:** markus -> m2d -> multilitreading tool