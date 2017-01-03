import { default as adminView } from "./admin/view";
import { default as view } from "./view";

const ID = "main__nav";

const render = (app, isAdmin) => {
    let currentView = isAdmin ? adminView : view;
    app.updateEl(
        ID,
        "innerHTML",
        currentView()
    );
};

const onAdmin = app => isAdmin =>
    render(app, isAdmin)

const init = app => {
    let {immute} = app;
    let data = immute.get();
    if (typeof data.admin != 'undefined') {
        immute.set('admin.on', false);
    }
    else {
        immute.set('admin', {on: false})
    }
    immute.on('admin.on', onAdmin(app));
};

export const confirmAdminMenu = immute => {
    let data = immute.get();
    if (typeof data.admin != 'undefined' && !data.admin.on) {
        immute.set('admin.on', true);
    }
}

export default {ID, render, init};