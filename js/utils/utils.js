export function getObjectFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

export function persistObjectToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function getFormattedDate() {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    const currentDate = new Date();
    return currentDate.toLocaleDateString('en-US', options);
}

export function getFormattedTime() {
    const options = { hour: '2-digit', minute: '2-digit', hour12: false };
    const currentTime = new Date();
    return currentTime.toLocaleTimeString('en-US', options);
}

export function timeout(millis, callback){
    return new Promise((resolve) => {
        setTimeout(() => {
            callback();
            resolve();
        }, millis);
    })
}

export function shouldIgnoreKeypress(event) {
    if (event.target.tagName && 
        (event.target.tagName === 'INPUT' ||
         event.target.tagName === 'TEXTAREA' ||
         event.target.getAttribute('contenteditable') === 'true')) {
      return true;
    }
  
    return false;
}

export function isTouchDevice() {
    return (('ontouchstart' in window) ||
       (navigator.maxTouchPoints > 0) ||
       (navigator.msMaxTouchPoints > 0));
}

export async function triggerImageSelection(crop){
    let selectionConfig = {
        types: [
            {
              description: "Images",
              accept: {
                "image/*": [".png", ".gif", ".jpeg", ".jpg", ".heic"],
              },
            },
          ],
          excludeAcceptAllOption: true,
          multiple: false
    }

    return showOpenFilePicker(selectionConfig)
    .then(([fileHandle]) => {
        return fileHandle.getFile();
    })
    .then((file) => {
        if(crop){
            return cropImage(file, 9, 19.5);
        }
        else{
            const reader = new FileReader();

            reader.readAsDataURL(file);
    
            return new Promise((resolve, reject) => {
                reader.onload = function (e) {
                    resolve(e.target.result);
                };
            });
        }
    })
    .catch((e) => {
        alert('Couldn\'t select an image');
        return null;
    });
}

function cropImage(file, aspectWidth, aspectHeight) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        img.onload = function () {
            const aspectRatio = aspectWidth / aspectHeight;
            const imgRatio = img.width / img.height;

            let cropWidth = img.width;
            let cropHeight = img.height;

            if (imgRatio > aspectRatio) {
                cropWidth = img.height * aspectRatio;
            } else {
                cropHeight = img.width / aspectRatio;
            }

            const offsetX = (img.width - cropWidth) / 2;
            const offsetY = (img.height - cropHeight) / 2;

            canvas.width = cropWidth;
            canvas.height = cropHeight;

            // Crop the image without stretching
            ctx.drawImage(img, offsetX, offsetY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

            // Convert the canvas content to a data URL
            const croppedDataURL = canvas.toDataURL('image/jpeg'); // You can change the format if needed

            resolve(croppedDataURL);
        };

        img.onerror = function (e) {
            reject(e);
        };

        const reader = new FileReader();
        reader.onload = function (e) {
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}