import { html, capitalize } from '../../../utils';

const item = obj => data => html`
    <tr>
        <td>${data[obj.title]}</td>
        <td><button class="btn btn--raised btn--blue" onclick="return ev('/admin/${obj.type}/edit/${data[obj.primary]}', 'route')">Edit</button></td>
        <td><button class="btn btn--raised btn--red" onclick="return ev({id:${data[obj.primary]}, type:'${obj.type}'}, 'deleteConfirm')">Delete</button></td>
    </tr>
`;

const pageItem = obj => page => page == obj.page ? `
        <li class="current"><span class="show-for-sr">You're on page </span>${page}</li>
    `
    : `
        <li><a href="/admin/${obj.type}/list?page=${page}">${page}</a></li>
    `;

export default obj => {
    let page = pageItem(obj);
    let content = item(obj);
    return `
        <div class="${obj.grid} animated fadeIn">
            <table class="g--12 card">
                <tr class="table-header">
                    <td>${capitalize(obj.title)}</td>
                    <td>Edit</td>
                    <td>Delete</td>
                </tr>
                ${obj.result.map(content).join('')} 
            </table>
            <ul class="pagination" role="navigation" aria-label="Pagination">
                ${obj.pages.map(page).join('')}
            </ul>
        </div>

    `;
}
