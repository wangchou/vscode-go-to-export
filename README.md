# vscode-go-to-export
A VSCode extension: use cursor word to "go to the export"

### Usage
When cursor at `sayHello()` in main.js, press `alt + .` will go to `export let sayHello` in utils.js.

```js
// main.js
import { sayHello } from './utils.js'
...
sayHello()

// utils.js
export let sayHello = () => { ... }
```

### Details
This extension use the `word under cursor` to search for

```js
export let 'cursor word' = ...
export var 'cursor word' = ...
export const 'cursor word' = ...
export function 'cursor word'( ... )
```
and jump to matched line.

### Keybinding
create your keybinding with `extension.go-to-export` command

For example:
```json
    {
        "key": "your shortcut",
        "command": "extension.go-to-export"
    },
```
