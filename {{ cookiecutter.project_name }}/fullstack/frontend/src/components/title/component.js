import { default as view } from "./view";
import { default as renderBase } from "../render";

const ID = "header__title";

const render = renderBase.withoutPrepData(ID, view);

export default {ID, render};