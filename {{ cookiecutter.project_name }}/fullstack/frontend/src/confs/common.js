import {default as content} from '../components/content/app';
import {default as title} from "../components/title/component";
import {default as messages} from "../components/messages/component";
import {default as headerView} from "../views/header";
import {default as preHeaderView} from "../views/pre-header";
import {default as mainView} from "../views/main";
import {default as user} from '../components/user/app';

const handlers = {
    route: {
    },
    request: {
    },
    response: {
    }
}

const views = [
    preHeaderView,
    headerView,
    mainView
];

const common = {};

common.components = {
    title,
    messages,
};

common.apps = {
    content,
    user
}

common.els = {};

common.pagination = 10;

common.handlers = handlers;

common.views = views;

common.model_init = {
    content: {},
    user: {}
}

export default common;
