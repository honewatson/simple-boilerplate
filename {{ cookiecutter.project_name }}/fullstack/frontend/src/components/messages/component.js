import { default as view } from "./view";
import { default as renderBase } from "../render";
const ID = "messages";

const reset = renderBase.reset(ID);

const render = app => (value, data) => {

    app.updateEl(
        ID,
        "innerHTML",
        view(data.messages)
    );
};

const init = app => {
    const messages = {
        success: [],
        errors: [],
        warning: [],
        notifications: []
    };
    app.immute.set('messages', messages);
    app.immute.on('messages.success', render(app), null);
    app.immute.on('messages.errors', render(app), null);
    app.immute.on('messages.warning', render(app), null);
    app.immute.on('messages.notifications', render(app), null);
};

export default {ID, render, init, reset};