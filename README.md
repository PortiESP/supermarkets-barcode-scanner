# Supermarket Barcode Scanner

This tool allows a programmer to implement a barcode scanner in his project

> ⚠️ **Submodules Alert!**
>
> This repo used submodules. To clone the repo with the submodules, use the following command:
>
> ```bash
> git clone --recurse-submodules https://github.com/PortiESP/supermarkets-barcode-scanner.git
> ```

## How to use

```js
// Import module
import { setupScanner } from './supermarkets-barcode-scanner/scanner.mjs'
```

```js
// Setup
const options = {
    detectionOptions: {
        debounce: 1000              // Time (in ms) between a new read can be made
    },       
    container: "#container",        // CSS selector of the container where the captured image will be displayed
    errorCallback: function (){},   // Function being called in case the setup fails
    readyCallback: function (){},   // Function being called in case the setup succeeds (recommend setup a flag here to prevent the `.start()` calls to be made before the setup)
    detectionCallback: function(code, format){},    // Function being called after a detection is made
}

const scanner = setupScanner(options)
```

> The `detectionCallback`
>
> **Parameters**
> - `code` : The scanner barcode numbers
> - `format` : The format of the barcode: E.G.: "ean_13", "upc", etc.


```js
// Start the scanner, display image
scanner.start()  

//...

// Stop the scanner, turn off the image
scanner.stop()
```

## Example project

**HTML**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="style.css">
    <title>Vite App</title>
  </head>
  <body>
    <div id="app">
      <div>chrome://flags/#unsafely-treat-insecure-origin-as-secure
      </div>
      <div>Status <span id="status"></span></div>
      <div id="camera"></div>
      <div id="result">
        <div>Code: <span id="result-id"></span> <button id="query">Query</button></div>
        <div>Data: <span id="result-data"></span></div>
      </div>
      <button id="stopcam">Stop</button>
    </div>
    <script type="module" src="/main.js"></script>
  </body>
</html>
```

**JavaScript**

```js
import { setupScanner } from './barcode-scanner/scanner.mjs'  // <--- replace this with the path of the module in your project

console.log("Script loaded")

const $status = document.querySelector("#status")
const errorCallback = () => {
    $status.textContent = "Error initializing the scanner!!!"
}
const readyCallback = () => {
    $status.textContent = "Scanner ready..."
    scanner.start()
}
const detectionCallback = (code, format, result) => {
    console.log(code, format, result)
}
const detectionOptions = {
    debounce: 1000
}
const container = "#camera"

const scanner = setupScanner({detectionOptions, container, errorCallback, readyCallback, detectionCallback})

document.querySelector("#stopcam").addEventListener('click', function () {
    console.log("Stopping...")
    $status.textContent = "Detenido..."
    scanner.stop()
})

```