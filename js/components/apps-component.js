import * as AppsData from '../data/apps.js';
import * as Modal from './app-modal-component.js';

let root = document.getElementById('apps-component');
let collapsed = true;

export function init(){
    AppsData.init();
    AppsData.subscribe(function(apps) {
        updateState(apps);
    });
}

//redraws the apps - not very efficient
export function updateState(apps){
    apps = apps.sort((b, a) => {
        if(a.selected)
            return 1;
        else if(b.selected)
            return -1;
        else{
            return parseInt(b.id - a.id);
        }
    });

    collapse();

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


    let dropdownButton;

    if(app.selected){
        el.classList.add('selected');

        dropdownButton = document.createElement('span');
        dropdownButton.classList.add('app-component-dropdown', 'material-symbols-outlined');
        dropdownButton.textContent = 'expand_more';
        dropdownButton.addEventListener('click', toggle);
    }
    else{
        el.classList.add('collapsed');
    }

    el.onclick = function(event){
        if(event.target.classList.contains('app-component-edit') ||
        event.target.classList.contains('app-component-dropdown'))
            return;
        else if(el.classList.contains('selected'))
            toggle();
        else
            onSelect(this.id);
    };

    editButton.onclick = function(){
        onEdit(app.id);
    }

    el.appendChild(appImage);
    el.appendChild(title);

    if(!app.default)
        el.appendChild(editButton);

    if(app.selected)
        el.appendChild(dropdownButton);

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

function toggle(){
    if(collapsed)
        open();
    else
        collapse();
}

function collapse(){
    Array.from(root.querySelectorAll('.app-component'))
    .slice(1)
    .forEach(el => el.classList.add('collapsed'));

    collapsed = true;

}

function open(){
    console.log(root.querySelectorAll('.app-component'))
    Array.from(root.querySelectorAll('.app-component'))
    .forEach(el => el.classList.remove('collapsed'));

    collapsed = false;
}

