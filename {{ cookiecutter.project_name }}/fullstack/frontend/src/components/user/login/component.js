import { default as view } from "./view";
import { default as renderBase } from "../../render";
import { default as componentConfig } from '../config';
import { capitalize } from  '../../../utils';
import { default as title } from '../../title/component';
import { default as model } from "../model";
import { default as req } from "../../../handlers/request/crud";

const ID = "main__content";

const render = renderBase.withoutPrepData(ID, view);

const loginModel = model();

loginModel.post = [
    'username',
    'password',
    'csrf_token'
]

loginModel.fields = [
    {id: 'username', type: 'text', default: ''},
    {id: 'password', type: 'password', default: ''},
    {id: 'csrf_token', type: 'hidden'}
];

loginModel.fields.forEach(field => {
    loginModel[field.id] = field;
});

loginModel.route = '/api/user/login.json';

const init = app => {
    app.immute.set('user_login', {model: loginModel});
}

const renderForm = (app, data) =>
    typeof data.user != 'undefined' ? app.router.navigate('/admin/content/list') : render(app, {model: loginModel, data});

const route = app => () => {
    title.render(app, {title: capitalize(componentConfig.base)});
    req.getRouteCached(app, loginModel.route, renderForm);
};

export default {
    ID,
    render,
    route: [`/user/login`, route],
    init
};