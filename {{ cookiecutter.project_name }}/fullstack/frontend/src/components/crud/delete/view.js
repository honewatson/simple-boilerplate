import { defaultValue } from  '../../../utils';

const deleteConfirm = (componentConfig, del) => del.id ? `
    <div class="card">
        Are you sure you would like to delete <strong>${del.title}</strong>? 
        <button class="btn btn--raised btn--green" onclick="return ev({type: '${componentConfig.base}', id: ${del.id}}, 'delete')">Yes</button>
        <button class="btn btn--raised btn--red" onclick="return ev('/admin/${componentConfig.base}/list', 'route')">No</button>      

    </div>
    `
    : "";

export default componentConfig => model => {
    return `
        <div class="${defaultValue('grid', 'g--9 m--3')(componentConfig)} animated fadeIn">
            <div class="alert-wrap">
                ${deleteConfirm(componentConfig, model)}
            </div>
        </div>
    `;
}
