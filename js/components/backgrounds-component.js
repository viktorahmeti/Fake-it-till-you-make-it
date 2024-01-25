import * as BackgroundsData from '../data/backgrounds.js';

let root = document.getElementById('backgrounds-component');

export function init(){
    BackgroundsData.init();
    BackgroundsData.subscribe(function(backgrounds) {
        updateState(backgrounds);
    });
}

export function updateState(backgrounds){
    let list = document.createElement('ul');
    list.classList.add('backgrounds-component-list');

    backgrounds.forEach((background) => {
        list.appendChild(createBackgroundComponent(background));
    });

    let newButton = document.getElementById('add-new-background-button');
    newButton.title = 'Add new';
    newButton.onclick = onNew;

    root.innerHTML = '';

    root.appendChild(list);
}

function createBackgroundComponent(background){
    let el = document.createElement('li');
    el.id = background.id;
    el.classList.add('background-component');

    let image = document.createElement('img');
    image.src = background.location;

    if(background.selected){
        el.classList.add('selected');
    }

    el.onclick = function(){
        onSelect(this.id);
    };

    el.appendChild(image);

    return el;
}

async function onNew(){
    //handle new here
    let base64Url = await triggerImageSelection();

    if(!base64Url)
        return;

    console.log(base64Url);

    BackgroundsData.createBackground(base64Url);
}

function onSelect(id){
    BackgroundsData.setSelectedBackground(id);
}

async function triggerImageSelection(){
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
        return cropImage(file, 9, 19.5);
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