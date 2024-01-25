import * as AppsComponent from './components/apps-component.js';
import * as MessageComponent from './data/message.js';
import * as BackgroundsComponent from './components/backgrounds-component.js';
import * as PhoneComponent from './components/phone-component.js';

AppsComponent.init();
MessageComponent.init();
BackgroundsComponent.init();
PhoneComponent.init();

function showOpenFilePickerPolyfill(options) {
    let changed = false;

    return new Promise((resolve) => {
        const input = document.createElement("input");
        input.type = "file";
        input.multiple = options.multiple;
        input.accept = options.types
            .map((type) => type.accept)
            .flatMap((inst) => Object.keys(inst).flatMap((key) => inst[key]))
            .join(",");
        
        input.style.display = 'none';
        document.body.appendChild(input);

        input.addEventListener("change", () => {
            resolve(
                [...input.files].map((file) => {
                    return {
                        getFile: async () =>
                            new Promise((resolve) => {
                                resolve(file);
                            }),
                    };
                })
            );
        });

        input.click();
    });
}

if (typeof window.showOpenFilePicker !== 'function') {
    window.showOpenFilePicker = showOpenFilePickerPolyfill
}