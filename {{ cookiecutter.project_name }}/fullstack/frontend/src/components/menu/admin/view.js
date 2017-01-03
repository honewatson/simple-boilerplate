import { capitalize } from '../../../utils';

const links = contentType => `
      <li class="dropdown"><a href="javascript:void(0)">${capitalize(contentType)}</a>
        <ul>
            <li><a href="javascript:void(0)" onclick="return ev('/admin/${contentType}/new', 'route')">New ${capitalize(contentType)}</a></li>
            <li><a href="javascript:void(0)" onclick="return ev('/admin/${contentType}/list', 'route')">Edit ${capitalize(contentType)}</a></li>
        </ul>
      </li>
`;

export default data => `
      <nav class="g--12 nav--horizontal">
        <ul class="nav__main">
            ${links('content')}
        </ul>
      </nav>
    `;