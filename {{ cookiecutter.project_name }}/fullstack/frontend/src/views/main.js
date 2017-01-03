const ID = "main";

const view = app => {
    let {component_ids} = app;
    return `
        <div id="${component_ids.messages}"></div>
        <div id="${component_ids.main__content}"></div>
    `;
}

export default {ID, view}