const eventManager = (app, listeners) => (obj, listener, add = false) => {
    if (typeof listeners[listener] != 'undefined') {
        listeners[listener](app, obj);
    }
    else if (add) {
        listeners[listener] = obj;
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