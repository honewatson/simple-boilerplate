import {default as view} from "./view";
import {default as model} from "./model";

const ID = "header__title";

const render = (app, data) => {
    app.updateEl(
        ID,
        "innerHTML",
        view(model(app, data))
    );
};

export default { ID, render };