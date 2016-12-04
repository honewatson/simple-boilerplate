const listeners =  {};

listeners.alert = (app, obj) => {
    alert(obj.getAttribute('data-message'));
};

listeners.updateImmute = (app, obj) => {
    app.immute.set(obj.getAttribute('data-immute'), obj.value);
}

export default listeners;