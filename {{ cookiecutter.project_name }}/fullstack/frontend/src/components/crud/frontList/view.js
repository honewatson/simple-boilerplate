import { html } from '../../../utils';

const item = obj => data => html`
    <li><a href="javascript:void(0)" onclick="return ev('/${obj.type}/${data[obj.primary]}', 'route')">${data[obj.title]}</a></li>
`;

const pageItem = obj => page => page == obj.page ? `
        <li class="current"><span class="show-for-sr">You're on page </span>${page}</li>
    `
    : `
        <li><a href="/${obj.type}?page=${page}">${page}</a></li>
    `;

export default obj => {
    let page = pageItem(obj);
    let content = item(obj);
    return `
        <div class="${obj.grid} animated fadeIn">
            <div class="card">
            <ul>
                ${obj.result.map(content).join('')} 
            </ul>
            </div>
            <ul class="pagination" role="navigation" aria-label="Pagination">
                ${obj.pages.map(page).join('')}
            </ul>
        </div>
    `;
}
