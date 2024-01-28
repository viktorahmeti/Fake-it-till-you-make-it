import * as AppsComponent from '../components/apps-component.js';
import * as Utils from '../utils/utils.js';

let apps;
let subscribers = [];
let systemApp;

export function init(){
    let defaultApps = [
        {
            id: 1,
            name: "Instagram",
            default: true,
            icon: "./social-icons/instagram.png",
            selected: true
        },
        {
            id: 2,
            selected: false,
            default: true,
            name: "Facebook",
            icon: "./social-icons/facebook.png"
        },
        {
            id: 3,
            name: "WhatsApp",
            default: true,
            selected: false,
            icon: "./social-icons/whatsapp.png"
        },
        {
            id: 4,
            name: "Snapchat",
            default: true,
            selected: false,
            icon: "./social-icons/snapchat.jpg"
        },
        {
            id: 5,
            name: "Messages",
            default: true,
            selected: false,
            icon: "./social-icons/messages.png"
        },
        {
            id: 6,
            name: "PayPal",
            default: true,
            selected: false,
            icon: "./social-icons/paypal.jpg"
        }
    ];
    
    let userApps = Utils.getObjectFromLocalStorage('apps');
    
    if(!userApps || userApps.length == 0){
        apps = defaultApps;
        persistAppsToLocalStorage();
    }
    else{
        apps = userApps;
    }

    systemApp = {
        id: Math.floor(Math.random() * 1000000),
        name: 'Wishful Thinking',
        icon: './social-icons/system.png'
    }
    
    AppsComponent.updateState(apps);
}

export function subscribe(callback){
    subscribers.push(callback);
}

function updateState(){
    subscribers.forEach((sub) => {
        sub(apps);
    });
}

function persistAppsToLocalStorage() {
    try{
        Utils.persistObjectToLocalStorage('apps', apps);
    }
    catch(e){
        console.error('Couldn\' store to local storage.');
    }
}

export function getAllApps() {
    return apps;
}

export function getApp(id){
    return apps.find(app => app.id == id);
}

export function createApp(newName, newIcon){
    //the id should be random enough
    let app = {
        id: Math.floor(Math.random() * 1000000),
        name: newName,
        icon: newIcon,
        selected: false
    }

    apps.push(app);
    persistAppsToLocalStorage();

    setSelectedApp(app.id);
}

export function editApp(id, newName, newIcon){
    apps = apps.map(app => app.id == id && !app.default ? { ...app, name: newName, icon: newIcon } : app);
    persistAppsToLocalStorage();
    
    updateState();
    setSelectedApp(id);
}

export function deleteApp(id){
    //can't delete everything bro
    if(apps.length == 1){
        return;
    }

    let wasSelected = false;

    apps = apps.filter((app) => {
        let toDelete;

        if((toDelete = app.id == id) && app.selected == true){
            wasSelected = true;
        }
        
        return !toDelete || app.default;
    });

    if(wasSelected){
        apps[0].selected = true;
    }

    persistAppsToLocalStorage();

    updateState();
}

export function getSelectedApp(){
    let selected = apps.find(app => app.selected === true);

    if(!selected){
        setSelectedApp(1);
        return getSelectedApp();
    }
    else{
        return selected;
    }
}

export function setSelectedApp(id){
    let currentSelectedApp = apps.find(app => app.selected == true);

    if(currentSelectedApp.id == id)
        return;

    if(currentSelectedApp)
        currentSelectedApp.selected = false;

    apps = apps.map(app => app.id == id ? { ...app, selected: true } : app);
    persistAppsToLocalStorage();

    updateState();
}

export function getSystemApp(){
    return systemApp;
}