import * as AppsData from '../data/apps.js';
import * as BackgroundsData from '../data/backgrounds.js';
import * as MessageData from '../data/message.js';

let currentApp;
let currentBackground;
let currentMessage;

let root = document.getElementById('phone-component');
let notificationsList = root.querySelector('.notifications-list');
let dateElement = root.querySelector('.phone-date');
let timeElement = root.querySelector('.phone-time');
let fullscreenButton = document.getElementById('fullscreen-button');
let exitFullscreenButton = document.getElementById('exit-fullscreen-button');
let flashlight = document.getElementById('flashlight');
let camera = document.getElementById('camera');
let touchDevice = isTouchDevice();
let introTutorialPlayed = false;
let fullscreenTutorialPlayed = false;

dateElement.textContent = getFormattedDate();
timeElement.textContent = getFormattedTime();
adjustPhoneElements();

document.addEventListener('keydown', onKeyPress);
flashlight.addEventListener('click', (event) => {
    event.preventDefault();
    deleteNotification();
});
camera.addEventListener('click', (event) => {
    event.preventDefault();
    pushNotification();
});
flashlight.addEventListener('dblclick', (event) => event.preventDefault());
camera.addEventListener('dblclick', (event) => event.preventDefault());

window.addEventListener('resize', adjustPhoneElements);
fullscreenButton.addEventListener('click', enterFullscreen);
exitFullscreenButton.addEventListener('click', exitFullscreen);
window.addEventListener('load', playTutorial);
document.addEventListener('fullscreenchange', fixScroll);

export function init(){
    currentApp = AppsData.getSelectedApp();
    currentBackground = BackgroundsData.getSelectedBackground();
    currentMessage = MessageData.getMessage();

    AppsData.subscribe(() => {
        currentApp = AppsData.getSelectedApp();
    });

    BackgroundsData.subscribe(() => {
        currentBackground = BackgroundsData.getSelectedBackground();
        updateState();
    });

    MessageData.subscribe((message) => {
        currentMessage = message;
    });

    updateState();
}

function updateState(){
    root.style.backgroundImage = `url(${currentBackground.location})`;
}

async function playTutorial(){
    if(introTutorialPlayed)
        return;

    await pushAfter(0, touchDevice? 'Press *Flashlight* to delete notifications' : 'Type \'Backspace\' to delete notifications');
    await pushAfter(1000, touchDevice? 'Press *Camera* to create notifications' : 'Type \'Space\' to create notifications');
    introTutorialPlayed = true;
}

async function playFullscreenTutorial(){
    if(fullscreenTutorialPlayed)
        return;

    await pushAfter(500, 'Press X button to exit fullscreen');

    fullscreenTutorialPlayed = true;
}

async function pushAfter(milliseconds, message){
    return new Promise((resolve) => {
        setTimeout(() => {
            pushNotification(message);
            resolve();
        }, milliseconds);
    })
}

function createNewNotification(message = currentMessage){
    let el = document.createElement('li');
    el.classList.add('notification');

    let container = document.createElement('div');
    container.classList.add('notification-container', 'translucent');

    let appImage = document.createElement('img');
    appImage.src = currentApp.icon;
    appImage.classList.add('notification-app-img');

    let notificationRightSide = document.createElement('div');
    notificationRightSide.classList.add('notification-right');

    let appName = document.createElement('span');
    appName.textContent = currentApp.name;
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
    if(shouldIgnoreEvent(event))
        return;

    let key = event.key;

    if(key === ' '){
        if(!currentMessage){
            alert('Please provide a notification message!');
            return;
        }
        pushNotification();
    }
    else if(key === "Backspace"){
        deleteNotification();
    }
}

function pushNotification (message = currentMessage) {
    let notification = createNewNotification(message);
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

function shouldIgnoreEvent(event) {
    const ignoredElements = ['INPUT', 'TEXTAREA'];
  
    if (event.target.tagName && ignoredElements.includes(event.target.tagName.toUpperCase())) {
      return true;
    }
  
    return false;
}

function adjustPhoneElements(){
    let ratio = 16 * root.getBoundingClientRect().width / 300;
    root.style.setProperty('--baseSize', `${ratio}px`);
}

async function enterFullscreen(){
    if(!currentMessage){
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

function isTouchDevice() {
    return (('ontouchstart' in window) ||
       (navigator.maxTouchPoints > 0) ||
       (navigator.msMaxTouchPoints > 0));
}

function fixScroll(){
    if(document.fullscreenElement)
        document.body.classList.add('noscroll');
    else
        document.body.classList.remove('noscroll');
}

function getFormattedDate() {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    const currentDate = new Date();
    return currentDate.toLocaleDateString('en-US', options);
}

function getFormattedTime() {
    const options = { hour: '2-digit', minute: '2-digit', hour12: false };
    const currentTime = new Date();
    return currentTime.toLocaleTimeString('en-US', options);
}