import * as AppsData from '../data/apps.js';
import * as Modal from './app-modal-component.js';

let root = document.getElementById('apps-component');

export function init(){
    AppsData.init();
    AppsData.subscribe(function(apps) {
        updateState(apps);
    });
}

//redraws the apps - not very efficient
export function updateState(apps){
    //draw the apps on the screen using getAppComponent
    let list = document.createElement('ul');
    list.classList.add('apps-component-list');

    apps.forEach((app) => {
        list.appendChild(createAppComponent(app));
    });

    let newButton = document.getElementById('add-new-app-button');
    newButton.title = 'Add new';
    newButton.onclick = onNew;

    root.innerHTML = '';

    root.appendChild(list);
}

function createAppComponent(app){
    let el = document.createElement('li');
    el.id = app.id;
    el.classList.add('app-component');

    let title = document.createElement('span');
    title.classList.add('app-component-name');
    title.textContent = app.name;

    let appImage = document.createElement('img');
    appImage.classList.add('app-component-image');
    appImage.src = app.icon;

    let editButton = document.createElement('span');
    editButton.classList.add('material-symbols-outlined', 'app-component-edit');
    editButton.textContent = 'edit';
    editButton.title = 'Edit'

    if(app.selected){
        el.classList.add('selected');
    }

    el.onclick = function(event){
        if(event.target.classList.contains('app-component-edit'))
            return;

        onSelect(this.id);
    };

    editButton.onclick = function(){
        onEdit(app.id);
    }

    el.appendChild(appImage);
    el.appendChild(title);

    if(app.canModify)
        el.appendChild(editButton);

    return el;
}

function onEdit(id){
    Modal.openModal(id);
}

function onNew(){
    Modal.openModal();
}

function onSelect(id){
    AppsData.setSelectedApp(id);
}

