import log from 'loglevel';
import { PanoViewport } from './PanoViewport';

var viewport: PanoViewport;
export function onDocumentLoaded() {
    log.enableAll();
    // Create a new viewport object.
    viewport = new PanoViewport({
        vrEnabled: true,
        gyroEnabled: true,
        fullscreenEnabled: true,
        debugMode: true,
    });

    // Initialize the viewport, which internally initializes krpano by calling embedpano.
    viewport.initialize(document.getElementById('parent') as HTMLElement);
}

// Cycles a new pano URL using the test images in this repo.
var index = -1;
export function setTestUrl() {
    index++;
    index %= 3;
    let input = document.getElementById('image-url') as HTMLInputElement;
    if (input) {
        input.value = `pano_test_${index}.png`;
    }
}

// Loads a pano using the URL provided.
export function loadUrl() {
    let url = (document.getElementById('image-url') as HTMLInputElement).value;
    viewport.loadPano(url);

    // Disable buttons.
    let entervr = document.getElementById('entervr-button') as HTMLButtonElement;
    if (entervr) {
        entervr.disabled = true;
    }

    let enterfs = document.getElementById('enterfullscreen-button') as HTMLButtonElement;
    if (enterfs) {
        enterfs.disabled = true;
    }
}

window.addEventListener('load', onDocumentLoaded);

document.getElementById('set-test-url-btn')?.addEventListener('click', () => {
    setTestUrl();
});

document.getElementById('load-button')?.addEventListener('click', () => {
    loadUrl();
});
