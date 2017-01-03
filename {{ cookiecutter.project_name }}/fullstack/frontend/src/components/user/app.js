import { default as login } from "./login/component";
import { default as register } from "./register/component";
import { default as forgotPassword } from "./forgot-password/component";
import { default as loggedin } from "./loggedin/component";
import { default as model } from "./model";


export default {
    model: model([login, register, forgotPassword, loggedin]),
};