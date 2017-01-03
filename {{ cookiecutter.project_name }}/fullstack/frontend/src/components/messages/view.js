import { html } from '../../utils';

const li = item =>
    html`<li>${item}</li>`

const isMessages = data =>
data.errors.length || data.success.length || data.warning.length || data.notifications.length;

const alert = (alertType, data) =>
    data[alertType].length ? `
        <label for="alert-check" onclick="return ev('${alertType}', 'resetMessages')">CLOSE</label>
        <div class="alert ${alertType}">
            <ul>
                ${data[alertType].map(li).join('')}
            </ul>
        </div>
    ` : "";

export default data =>
    isMessages(data) ? `
        <div class="g--8 m--3 animated fadeInDown">
            <div class="alert-wrap card">
                <input type="checkbox" id="alert-check">
                ${alert('errors', data)}
                ${alert('success', data)}
                ${alert('warning', data)}
                ${alert('notifications', data)}
            </div>    
        </div>
        ` : "";
