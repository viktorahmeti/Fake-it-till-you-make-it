import * as AppsData from '../data/apps.js';
import * as Utils from '../utils/utils.js';

let root = document.getElementById('app-modal-component');

let appNameInput;
let imagePreview;

export function openModal(id){
    createModal(id);
    root.parentElement.parentElement.classList.add('show');
}

export function closeModal(){
    root.parentElement.parentElement.classList.remove('show');
    resetData();
}

//creates the inside of the modal
function createModal(id){
    let app = AppsData.getApp(id);

    let closeModalButton = document.getElementById('close-modal-button');
    closeModalButton.onclick = closeModal;
    
    appNameInput = document.createElement('input');
    appNameInput.value = app? app.name : '';
    appNameInput.size = 30;
    appNameInput.placeholder = 'Instagram...';

    let appNameLabel = document.createElement('label');
    appNameLabel.textContent = 'Name';

    let appNameContainer = document.createElement('div');
    appNameContainer.classList.add('app-name-input');
    appNameContainer.appendChild(appNameLabel);
    appNameContainer.appendChild(appNameInput);


    let appIconLabel = document.createElement('label');
    appIconLabel.textContent = 'Icon';

    let imagePicker = document.createElement('span');
    if(app){
        imagePreview = createImagePreview(app.icon);
        imagePicker.appendChild(imagePreview);
    }
    else{
        let newImageButton = document.createElement('span');
        newImageButton.textContent = '+';
        newImageButton.classList.add('add-new-button');
        imagePicker.appendChild(newImageButton);
    }

    imagePicker.onclick = async function(){
        let base64Url = await Utils.triggerImageSelection(false);

        if(!base64Url)
            return;

        if(imagePreview){
            imagePreview.src = base64Url;
        }
        else{
            imagePreview = createImagePreview(base64Url);
            imagePicker.innerHTML = '';
            imagePicker.appendChild(imagePreview);
        }

    }


    let appIconContainer = document.createElement('div');
    appIconContainer.classList.add('app-image-input');
    appIconContainer.appendChild(appIconLabel);
    appIconContainer.appendChild(imagePicker);


    let saveButton = document.createElement('button');
    saveButton.classList.add('app-save-button');
    saveButton.textContent = 'save';
    saveButton.onclick = function() {
        if(!appNameInput.value || !imagePreview?.src){
            alert('Please select a name and an image!');
            return;
        }

        onSave(app? app.id : -1, appNameInput.value, imagePreview?.src);
    };

    let deleteButton;
    if(app){
        deleteButton = document.createElement('button');
        deleteButton.textContent = 'delete';
        deleteButton.classList.add('app-delete-button');
    
        deleteButton.onclick = function() {
            if(confirm('Are you sure you want to delete this app?')){
                onDelete(app.id);
            }
        };
    }

    root.innerHTML = '';
    root.appendChild(appNameContainer);
    root.appendChild(appIconContainer);
    root.appendChild(saveButton);

    if(app){
        root.appendChild(deleteButton);
    }
}

function onDelete(id){
    AppsData.deleteApp(id);
    closeModal();
}

function onSave(id, name, icon){
    if(id == -1){
        AppsData.createApp(name, icon);
    }
    else{
        AppsData.editApp(id, name, icon);
    }

    closeModal();
}

function createImagePreview(src){
    let imagePreview = document.createElement('img');
    imagePreview.src = src;
    imagePreview.classList.add('app-modal-component-preview');
    return imagePreview;
}

function resetData(){
    imagePreview = undefined;
    appNameInput = undefined;
}