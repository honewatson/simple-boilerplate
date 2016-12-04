import { default as common } from './confs/common';

const config = {};

Object.keys(common).forEach(key => {
    config[key] = common[key];
});

const component_ids = {};

let {els, components} = config;

Object.keys(components).forEach(component => {
    let com = components[component];
    els[com.ID]= null;
    component_ids[com.ID] = com.ID;
});


config.component_ids = component_ids;

export default config;