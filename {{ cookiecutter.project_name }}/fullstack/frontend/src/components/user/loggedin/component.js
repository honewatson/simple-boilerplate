import { default as view } from "./view";
import { default as renderBase } from "../../render";
import { default as req } from "../../../handlers/request/crud";
import { default as footer } from "../../footer/component";

const ID = "header__nav_logout";

const renderInternal = renderBase.withoutPrepData(ID, view);

const render = (app, data) => {
    req.getRouteCached(app, '/api/user/login.json', [renderInternal, footer.render]);
}

export default {ID, render, resetAlways: render};