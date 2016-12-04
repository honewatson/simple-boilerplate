class App {

    constructor(window, document, router, evPartial, immute, config) {
        this.window = window;
        this.document = document;
        this.router = router;
        this.ev = evPartial(this);
        this.immute = immute;
        this.config = config;
        this.location = window.location;
        this.els = config.els;
        this.handlers = config.handlers;
    }

    start() {
        let {views, routes, components} = this.config;

        views.forEach(view => {

            this.updateEl(view.ID, 'innerHTML', view.view(this));
        });
        routes.forEach(route => {
            this.router.route(route[0], route[1](this));
        });
        Object.keys(components).forEach( component => {
            let com = components[component];
            if (typeof com.init != 'undefined') {
                com.init(this);
            }
        });

        this.router.start();
    }

    ready(el, prop, value) {
        setTimeout(() => this.updateEl(el, prop, value), 10);
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