const ID = "header";

const view = app => {
    let {component_ids} = app;
    return `
        <div id="${component_ids.header__title}" class="g--9 margin-top-bottom-0"></div>
    
        <div id="header_nav" class="g--3 margin-top-bottom-0">
            <div id="${component_ids.header__nav_logout}"></div>
        </div>
    `;
}

export default  {ID, view}