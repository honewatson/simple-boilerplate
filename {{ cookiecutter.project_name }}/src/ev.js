const eventManager = (app, listeners) => (obj, listener) => {
    if(typeof listeners[listener] != 'undefined') {
        listeners[listener](app, obj);
    }
    else {
        throw `Event named ${listener} was not found!`
    }
};

const eventManagerFactory = (window, listeners) => app => {
    const ev = eventManager(app, listeners);
    window.ev = ev;
    return ev;
}

export {
    eventManager,
    eventManagerFactory
};