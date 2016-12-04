import {default as title} from "../components/title/render";
import {default as content} from "../components/content/render";
import {default as indexRouteHandler} from "../handlers/route/index";
import {default as headerView} from "../views/header";
import {default as mainView} from "../views/main";

const handlers = {
    route: {
        index: indexRouteHandler
    },
    request: {

    },
    response: {

    }
}

const views = [
    headerView,
    mainView
];

const common = {};

common.components = {
    title,
    content
};

common.els = {};

common.routes = [
    ["/", indexRouteHandler]
];

common.handlers = handlers;

common.views = views;

export default common;