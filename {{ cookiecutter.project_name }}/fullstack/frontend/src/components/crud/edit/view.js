import { fieldsCls, baseFields } from '../fields';

const buttons = obj => `
    <button class="btn--blue btn--raised" onclick="return ev('${obj.model.type}', '${obj.method}')" type="submit" id="submit" name="submit">
        Submit
    </button>                
    <button class="btn--red btn--raised" onclick="return ev('/admin/${obj.model.type}/list', 'route')" type="submit" id="submit" name="submit">
        Cancel
    </button>      
`;

export default (buttonsTmpl = buttons) => obj => {
    let fieldOpts = typeof obj.fields != 'undefined' ? obj.fields : baseFields;
    let fields = fieldsCls(fieldOpts, obj.model.type, obj.data);
    return `
        <div class="${obj.grid} animated fadeIn">
            <div class="card">                         
                ${obj.model.fields.map(fields).join('')}
                <div class="g--12 cb">
                     ${buttonsTmpl(obj)}
                </div>
            </div>
        </div>
    `;
}
