import * as AppsData from '../data/apps.js';
import * as BackgroundsData from '../data/backgrounds.js';
import * as MessageData from '../data/message.js';
import * as Utils from '../utils/utils.js';

let root = document.getElementById('phone-component');
let notificationsList = root.querySelector('.notifications-list');
let dateElement = root.querySelector('.phone-date');
let timeElement = root.querySelector('.phone-time');
let fullscreenButton = document.getElementById('fullscreen-button');
let exitFullscreenButton = document.getElementById('exit-fullscreen-button');
let flashlight = document.getElementById('flashlight');
let camera = document.getElementById('camera');
let touchDevice = Utils.isTouchDevice();
let introTutorialPlayed = false;
let fullscreenTutorialPlayed = false;

dateElement.textContent = Utils.getFormattedDate();
timeElement.textContent = Utils.getFormattedTime();
adjustPhoneElements();

document.addEventListener('keydown', onKeyPress);
flashlight.addEventListener('click', (event) => {
    event.preventDefault();
    deleteNotification();
});
camera.addEventListener('click', (event) => {
    event.preventDefault();
    pushNotification(MessageData.getMessage(), AppsData.getSelectedApp());
});
flashlight.addEventListener('dblclick', (event) => event.preventDefault());
camera.addEventListener('dblclick', (event) => event.preventDefault());

window.addEventListener('resize', adjustPhoneElements);
fullscreenButton.addEventListener('click', enterFullscreen);
exitFullscreenButton.addEventListener('click', exitFullscreen);
window.addEventListener('load', playTutorial);
document.addEventListener('fullscreenchange', fixScroll);

export function init(){
    BackgroundsData.subscribe(() => {
        updateState();
    });

    updateState();
}

function updateState(){
    root.style.backgroundImage = `url(${BackgroundsData.getSelectedBackground().location})`;
}

async function playTutorial(){
    if(introTutorialPlayed)
        return;

    await Utils.timeout(0, () => {
        pushNotification(touchDevice? 'Press *Flashlight* to delete notifications' : 'Type \'Backspace\' to delete notifications', AppsData.getSystemApp());
    });

    await Utils.timeout(1000, () => {
        pushNotification(touchDevice? 'Press *Camera* to create notifications' : 'Type \'Space\' to create notifications', AppsData.getSystemApp());
    });

    introTutorialPlayed = true;
}

async function playFullscreenTutorial(){
    if(fullscreenTutorialPlayed)
        return;

    await Utils.timeout(500, () => {
        pushNotification('Press X button to exit fullscreen', AppsData.getSystemApp());
    });

    fullscreenTutorialPlayed = true;
}

function createNewNotification(message, app){
    let el = document.createElement('li');
    el.classList.add('notification');

    let container = document.createElement('div');

    if(/^((?!chrome|android).)*safari/i.test(navigator.userAgent)){
        container.classList.add('notification-container', 'translucent-true');
    }
    else{
        container.classList.add('notification-container', 'translucent');
    }

    let appImage = document.createElement('img');
    appImage.src = app.icon;
    appImage.classList.add('notification-app-img');

    let notificationRightSide = document.createElement('div');
    notificationRightSide.classList.add('notification-right');

    let appName = document.createElement('span');
    appName.textContent = app.name;
    appName.classList.add('phone-app-name');

    let messageElement = document.createElement('span');
    messageElement.textContent = message;
    appName.classList.add('phone-notification-message');

    notificationRightSide.appendChild(appName);
    notificationRightSide.appendChild(messageElement);

    container.appendChild(appImage);
    container.appendChild(notificationRightSide);

    el.appendChild(container);

    return el;
}

function onKeyPress(event){
    if(Utils.shouldIgnoreKeypress(event))
        return;

    let key = event.key;

    let currentMessage = MessageData.getMessage();

    if(key === ' '){
        if(!currentMessage){
            alert('Please provide a notification message!');
            return;
        }
        pushNotification(currentMessage, AppsData.getSelectedApp());
    }
    else if(key === "Backspace"){
        deleteNotification();
    }
}

function pushNotification (message, app) {
    let notification = createNewNotification(message, app);
    notification.classList.add('close');
    notification.classList.add('optimize');
	notificationsList.insertAdjacentElement('afterBegin', notification)
	
	setTimeout(() => {
		notification.classList.remove('close')
		setTimeout(() => {
			notification.classList.remove('optimize')
		}, 875);
	}, 25);
}

function deleteNotification(){
    let toDelete = notificationsList.querySelector('.notification:not(.close)');
    
    if(!toDelete)
        return;

    toDelete.classList.add('optimize')
    toDelete.classList.add('close')

    setTimeout(() => {
        toDelete.remove()
    }, 875);
}

function adjustPhoneElements(){
    let ratio = 16 * root.getBoundingClientRect().width / 315;
    root.style.setProperty('--baseSize', `${ratio}px`);
}

async function enterFullscreen(){
    if(!MessageData.getMessage()){
        alert('Please provide a notification message!');
        return;
    }

    if(root.parentElement.requestFullscreen && !touchDevice){
        root.parentElement.requestFullscreen({ navigationUI: "hide" });
    }
    else{
        root.parentElement.classList.add('fullscreen');
    }

    document.body.classList.add('noscroll');

    adjustPhoneElements();
    playFullscreenTutorial();
}

async function exitFullscreen(){
    if(document.fullscreenElement){
        document.exitFullscreen();
    }

    root.parentElement.classList.remove('fullscreen');
    document.body.classList.remove('noscroll');
}

function fixScroll(){
    if(document.fullscreenElement)
        document.body.classList.add('noscroll');
    else
        document.body.classList.remove('noscroll');
}