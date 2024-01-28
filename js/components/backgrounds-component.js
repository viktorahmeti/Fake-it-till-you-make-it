import * as BackgroundsData from '../data/backgrounds.js';
import * as Utils from '../utils/utils.js';

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
    let base64Url = await Utils.triggerImageSelection(true);

    if(!base64Url)
        return;

    console.log(base64Url);

    BackgroundsData.createBackground(base64Url);
}

function onSelect(id){
    BackgroundsData.setSelectedBackground(id);
}