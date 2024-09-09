import Quagga from 'quagga' // ES6
import { queryBarcode } from './supermarkets-barcodes-api-proxy/modules/proxy'

let lastDetectionTimestamp = 0


/**
 * Setup the barcode scanner
 * 
 * @param {Object} options The options for the scanner
 * @param {String} options.container The container where the scanner will be placed
 * @param {Function} options.errorCallback The callback to be executed when an error occurs
 * @param {Function} options.readyCallback The callback to be executed when the scanner is ready
 * @param {Function} options.detectionCallback The callback to be executed when a barcode is detected
 * @param {Object} options.detectionOptions The options for the detection
 * @param {Boolean} options.detectionOptions.fetchBarcode Whether if the barcode should be fetched from the API
 * @param {Number} options.detectionOptions.debounce The debounce time in ms
 * @returns The start and stop functions for the scanner
 */
export function setupScanner({ container, errorCallback, readyCallback, detectionCallback, detectionOptions }) {
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
                "ean_reader",
                "ean_8_reader",
                // "code_128_reader",
                // "upc_reader",
                // "upc_e_reader",
                // "code_39_reader",
                // "i2of5_reader",
                // "2of5_reader",
                // "codabar_reader"
            ]
        }
    }, function (err) {
        // If there was an error during setup
        if (err) {
            if (errorCallback) errorCallback()
            return console.error("[!] Error setting up the barcode scanner")
        }

        // Custom callback
        if (readyCallback) readyCallback()
    })

    // Setup the detection callback
    const { fetchBarcode, debounce } = detectionOptions
    Quagga.onDetected(async data => {
        // Prevent multiple calls to the callback for the same code
        if (debounce) {
            // Check debounce time
            const now = Date.now()
            if (now - lastDetectionTimestamp < debounce) return false  // Debounced

            // If passed the debounce time, update the timestamp
            lastDetectionTimestamp = now
        }

        // Custom callback
        if (detectionCallback) detectionCallback(data.codeResult.code, data.codeResult.format)
    })

    // Return start/stop functions
    return {
        start: Quagga.start,
        stop: Quagga.stop
    }
}