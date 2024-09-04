import Quagga from 'quagga' // ES6
import { queryBarcode } from './supermarkets-barcodes-api-proxy/modules/proxy'

let lastDetectionTimestamp = 0

export function setupScanner({ container, readyCallback, detectionCallback, debounce }) {
    // Setup of the barcode scanner
    Quagga.init({
        // Set the device camera as the source of images
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector(container)  // Or '#yourElement' (optional)
        },
        // Enable detection of different formats
        decoder: {
            readers: [  // Define the formats that we want the scanner to recognize
                "code_128_reader",
                "ean_reader",
                "ean_8_reader",
                "upc_reader",
                "upc_e_reader",
                "code_39_reader",
                "i2of5_reader",
                "2of5_reader",
                "codabar_reader"
            ]
        }
    }, function (err) {
        // If there was an error during setup
        if (err) return console.err(err)

        // If the setup was successful
        Quagga.start()
        // Custom callback
        if (readyCallback) readyCallback()
    })

    Quagga.onDetected(async data => {
        // Prevent multiple calls to the callback for the same code
        if (debounce){
            const now = Date.now()
            if (now - lastDetectionTimestamp < debounce) return false  // Debounced

            lastDetectionTimestamp = now
        }

        await queryBarcode(data)

        // Custom callback
        if (detectionCallback) detectionCallback(data)
    })

    return {
        start: Quagga.start,
        stop: Quagga.stop
    }
}