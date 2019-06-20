# vscode-go-to-export
Go to

* exported js module
* class / function / variable
* React or Svelte components

by `the word under cursor`

(:warning: this extension using proposed api => need to use insider version vscode)

### Usage
Move cursor to `sayHello()` in main.js, press `alt + .` will go to `export let sayHello` in utils.js.

```js
// main.js
import { sayHello } from './utils.js'
...
sayHello()

// utils.js
export let sayHello = () => { ... }
```

### Keybinding
create your keybinding with `extension.go-to-export` command

For example:
```json
    {
        "key": "your shortcut",
        "command": "extension.go-to-export"
    },
```

### Details
This extension use the `word under cursor` to search for

```js
    export let 'cursor word' = ...
    export var 'cursor word' = ...
    export const 'cursor word' = ...
    export function 'cursor word'( ... )
    export { 'cursor word', ... }
```
and jump to matched line.

....

NOT FOUND => search for `class / function / variable`

```js
    class 'cursor word' { ... }
    function 'cursor word'(...) { ... }
    let 'cursor word'
    var 'cursor word'
    const 'cursor word'
```

STILL NOT FOUND => search for `React / Svelte Component`

```js
    `${cursor word}.svelte`
    `${cursor word}.js`
    `${cursor word}/index.js`
    `${cursor word}.jsx`
    `${cursor word}/index.jsx`
```
