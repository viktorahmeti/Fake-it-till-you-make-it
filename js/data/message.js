let inputElement;
let subscribers = [];
let message;

export function init(){
    inputElement = document.getElementById('message-input');
    inputElement.addEventListener('input', updateState);
    updateState();
}

export function subscribe(callback){
    subscribers.push(callback);
}

export function getMessage(){
    return message;
}

export function setMessage(newMessage){
    inputElement.value = newMessage;
    updateState();
}

function updateState(){
    message = inputElement.value;
    subscribers.forEach((sub) => {
        sub(message);
    });
}

