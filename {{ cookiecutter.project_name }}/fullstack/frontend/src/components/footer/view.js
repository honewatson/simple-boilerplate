const admin = obj => ['Admin', 'Superuser'].indexOf(obj.group) !== -1 ? `
    <ul>
        <li>Admin Menu</li>
        <li><a href="javascript:void(0)" onclick="return ev('/admin/content/list', 'route')">Content</a></li>            
    </ul>` : '';

const read = obj => ['Read', 'Admin', 'Superuser'].indexOf(obj.group) !== -1 ? `
    <ul>
        <li>Main Menu</li>
        <li><a href="javascript:void(0)" onclick="return ev('/content', 'route')">Content</a></li>
    </ul>` : '';

export default obj => `
        <footer class="g--12 no-margin-vertical container bg--midnight-blue">
            <div class="g--2 no-margin-vertical  color--white">
                ${read(obj)}
            </div>
            <div class="g--2 no-margin-vertical  color--white">
                ${admin(obj)}
            </div>
        </footer>
    `;

