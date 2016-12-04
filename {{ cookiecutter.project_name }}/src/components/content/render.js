import {default as view} from "./view";
import {default as model} from "./model";

const ID = "main__content";

const init = app => {
    let {immute} = app;
    immute.set('content', { story: "a funny one"});
    immute.on('content.story', () => app.updateEl(
        "content__story",
        "innerHTML",
        immute.get().content.story
    ), null);
};

const render = (app, data) => {
    app.updateEl(
        ID,
        "innerHTML",
        view(model(app, data))
    );
};

export default { ID, render, init };