const differentRouteAdmin = (route_previous, route_current) =>
route_previous
&& route_previous[1] === 'admin' && route_current[1] === 'admin'
&& route_previous[2] !== route_current[2]

const differentRoute = (route_previous, route_current) =>
route_previous
&& route_previous[1] !== route_current[1]


class App {

    constructor(window, document, router, evPartial, immute, crudReq, config) {
        this.window = window;
        this.document = document;
        this.router = router;
        this.ev = evPartial(this);
        this.immute = immute;
        this.crudReq = crudReq;
        this.config = config;
        this.location = window.location;
        this.els = {};
        this.component_ids = {};
        this.models = {};
        this.store = {};
        window.appInst = this;
        this._reset_items = [];
        this._reset_items_always = [];

    }

    set(key, value) {
        this.store[key] = value;
    }

    setQueue(key, value) {
        let {queue} = this.store;
        if (typeof queue[key] === 'undefined') {
            queue[key] = [].concat(value);
        }
        else {
            queue[key] = queue[key].concat(value);
        }
    }

    getQueue(key) {
        return this.store.queue[key];
    }

    resetItems() {
        let app = this;
        let {route_previous, route_current} = app.store;
        if (
            differentRouteAdmin(route_previous, route_current) ||
            differentRoute(route_previous, route_current)
        ) {
            this._reset_items.forEach(render => {
                render(app);
            });
        }

        this._reset_items_always.forEach(render => {
            render(app);
        });
    }

    reset(routeRender) {
        let app = this;
        return (...params) => {
            if (typeof app.store.route_current !== 'undefined') {
                app.set('route_previous', app.store.route_current);
            }
            app.set('route_current', app.location.pathname.split('/'));
            app.set('requests_cache', {});
            app.set('queue', {});
            app.resetItems();
            routeRender.apply(null, params);
        }
    }

    requestCache(route, data = null) {
        if (data) {
            this.store.requests_cache[route] = data;
            return data;
        }
        else if (typeof this.store.requests_cache[route] === 'undefined') {
            return false;
        }
        else {
            return this.store.requests_cache[route];
        }
    }

    component(com) {

        if (typeof com.init !== 'undefined') {
            com.init(this);
        }
        if (typeof com.reset !== 'undefined') {
            this._reset_items = this._reset_items.concat(com.reset);
        }
        if (typeof com.resetAlways !== 'undefined') {
            this._reset_items_always = this._reset_items_always.concat(com.resetAlways);
        }
        if (typeof com.route !== 'undefined') {
            this.router.route(com.route[0], this.reset(com.route[1](this)));
        }
        this.els[com.ID] = null;
        this.component_ids[com.ID] = com.ID;

    }

    model(app) {
        let model = app.model;
        model.components.forEach(com => this.component(com));
        return model;
    }

    start() {
        this.set('route_previous', null);
        let {views, components, apps} = this.config;

        Object.keys(components).forEach(component => {
            let com = components[component];
            this.component(com);
        });
        Object.keys(apps).forEach(name => {
            let model = this.model(apps[name]);
            this.immute.set(`${name}.model`, model);
        });
        views.forEach(view => {
            this.updateEl(view.ID, 'innerHTML', view.view(this));
        });
        this.router.start();
    }

    ready(el, prop, value) {
        setTimeout(() => this.updateEl(el, prop, value), 10);
    }


    readyC(el, callback) {
        let elInst = this.document.getElementById(el);
        if (elInst) {
            callback(this, elInst, el);
        } else {
            setTimeout(() => this.readyC(el, callback), 10);
        }
    }

    readyF(fn, callback) {
        if (fn()) {
            callback(this);
        } else {
            setTimeout(() => this.readyF(fn, callback), 10);
        }
    }


    _mutateEl(el, prop, value) {

        if (typeof value == 'function') {
            this.els[el][prop] = value(this.els[el]);
        }
        else {
            this.els[el][prop] = value;
        }
    }

    updateEl(el, prop, value) {
        const updateEl = (app, el, prop, value) => {
            let elInst = app.document.getElementById(el);
            if (typeof elInst == 'undefined') {
                app.ready(el, prop, value)
            }
            else {
                app.els[el] = elInst;

                app._mutateEl(el, prop, value);
            }
        }
        if (typeof this.els[el] == 'undefined' || this.els[el] == null) {
            updateEl(this, el, prop, value);
        }
        else {
            this._mutateEl(el, prop, value);
        }
    }

}

export default App
