import * as BackgroundsComponent from '../components/backgrounds-component.js';

let backgrounds;
let subscribers = [];

export function init(){
    backgrounds = [
        {
            id: 1,
            location: './backgrounds/background-1.jpg',
            selected: true
        },
        {
            id: 2,
            location: './backgrounds/background-2.jpg',
            selected: false
        },
        {
            id: 3,
            location: './backgrounds/background-3.jpg',
            selected: false
        }
    ];

    BackgroundsComponent.updateState(backgrounds);
}

export function subscribe(callback){
    subscribers.push(callback);
}

function updateState(){
    subscribers.forEach((sub) => {
        sub(backgrounds);
    });
}

export function getAllBackgrounds(){
    return backgrounds;
}

export function getBackground(id){
    return backgrounds.find(background => background.id == id);
}

export function createBackground(imageData){
    backgrounds.unshift({
        id: Math.floor(Math.random() * 1000000),
        location: imageData,
        selected: false
    });

    updateState();
}

export function getSelectedBackground(){
    let selected = backgrounds.find(background => background.selected === true);

    if(!selected){
        setSelectedBackground(1);
        return getSelectedBackground();
    }
    else{
        return selected;
    }
}

export function setSelectedBackground(id){
    let currentSelectedBackground = backgrounds.find(background => background.selected === true);
    if(currentSelectedBackground)
        currentSelectedBackground.selected = false;

    backgrounds = backgrounds.map(background => background.id == id ? { ...background, selected: true } : background);
    
    updateState();
}
