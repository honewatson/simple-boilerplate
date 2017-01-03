import { default as qwest } from 'qwest';
import { default as req } from './handlers/request/crud';

qwest.setDefaultDataType('json');

const listeners = {};

listeners.alert = (app, obj) => {
    alert(obj.getAttribute('data-message'));
};

listeners.updateImmute = (app, obj) => {
    app.immute.set(obj.getAttribute('data-immute'), obj.value);
}

listeners.post = (app, model) => {
    req.save('post', app, model);
}

listeners.postRedirect = (app, model) => {
    let redirect = route => app => {
        app.router.navigate(route);
    }
    req.save('post', app, model.model, redirect(model.route));
}

listeners.getRedirect = (app, obj) => {
    req.getRoute(app, obj.route, obj.redirect);
}


listeners.put = (app, model) => {
    req.save('put', app, model);
}

listeners.deleteConfirm = (app, obj) => {
    let route = `/admin/${obj.type}/delete/${obj.id}`;
    app.router.navigate(route);
}

listeners.delete = (app, obj) => {
    req.del(app, obj);
}

listeners.deleteRefresh = (app, obj) => {
    req.delRefresh(app, obj);
}

listeners.route = (app, route) => {
    app.router.navigate(route);
}

listeners.resetMessages = (app, obj) => {
    app.immute.set(`messages.${obj}`, []);
}

export default listeners;
