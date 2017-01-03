import { capitalize, defaultValue, isValue } from '../../utils';

const label = (field, modelType) => `
        <label for="${modelType}__${field.id}">${typeof field.label != 'undefined' ? field.label : capitalize(field.id)}</label>
    `;

const hidden = (field, modelType, data) => `
        <input type="hidden" name="${modelType}__${field.id}" value="${data[field.id]}" id="${modelType}__${field.id}">
    `;

const primary = (field, modelType, data) =>
    hidden(field, modelType, data)

const input = (field, modelType, data) => `
        ${label(field, modelType)}
        <input type="${field.type}" id="${modelType}__${field.id}" name="${modelType}__${field.id}" value="${defaultValue(field.id, field.default)(data)}"  />
    `;

const text = (field, modelType, data) =>
    input(field, modelType, data)

const password = (field, modelType, data) =>
    input(field, modelType, data)

const textarea = (field, modelType, data) => `
        ${label(field, modelType)}
        <textarea class="g--12 input-field" id="${modelType}__${field.id}" name="${modelType}__${field.id}">${defaultValue(field.id, field.default)(data)}</textarea>
    `;

const wysiwyg = (field, modelType, data) => `
        ${label(field, modelType)}
        <div class="g--12 input-field" data-editable data-name="${modelType}__${field.id}" id="${modelType}__${field.id}">                              
            ${defaultValue(field.id, field.default)(data)}                        
        </div>
    `;

const optionFactory = (data, field) => opt => `
    <option value="${opt.value}" ${opt.value == data[field.id] ? 'selected' : ''}>${opt.name}</option>
`;

const select = (field, modelType, data) => {
    let option = optionFactory(data, field);
    return `
        <div class="g--12 input-field">
            ${label(field, modelType)}
            <select id="${modelType}__${field.id}" name="${modelType}__${field.id}">
                ${field.options.map(option)}
            </select>
        </div>
    `;
}

const checkboxSingle = (fieldType, selected, data, field, modelType, opt) => `
    <input type="${fieldType}" name="${modelType}__${field.id}" value="${opt.value}" ${opt.value == defaultValue(field.id, field.default)(data) ? selected : ''} />
        <label>${capitalize(opt.name)}</label>
`

const checkboxRadioFactory = (fieldType, selected) => (data, field, modelType) => opt => `
    <li>
        ${checkboxSingle(fieldType, selected, data, field, modelType, opt)}
    </li>
`;

const checkbox = (field, modelType, data) => {
    let selected = defaultValue(field.id, field.default)(data);
    return `
        <div data-type="checkbox" id="${modelType}__${field.id}">
            ${checkboxSingle('checkbox', selected, data, field, modelType, field.options[0])}
        </div>
         
    `;
}

const checkboxFactory = checkboxRadioFactory('checkbox', 'checked');

const radioFactory = checkboxRadioFactory('radio', 'checked');

const checkboxesRadiosFactory = (fieldType, optionFactory) => (field, modelType, data) => {
    let option = optionFactory(data, field, modelType);
    return `
        <div class="g--12 input-field ${fieldType}"  id="${modelType}__${field.id}" data-type="${fieldType}">
            <ul>
            ${field.options.map(option).join('')}
            </ul>
        </div>
    `;
}

const checkboxes = checkboxesRadiosFactory('checkbox', checkboxFactory);

const radios = checkboxesRadiosFactory('radio', radioFactory);

const fileInfoView = field => {
    return `
        <div class="card">${field.filepath}</div>
    `;
}

const fileInfo = (data, field) =>
    data[field.id] ? fileInfoView(JSON.parse(data[field.id])) : '';

const decorateFile = field => {
    let fieldLabel = typeof field.label != 'undefined' ? field.label : capitalize(field.id);
    field.label = "Upload " + fieldLabel;
    return field;
}

const file = (field, modelType, data) => `
    <div class="g--12">
        ${input(decorateFile(field), modelType, data)}
        ${fileInfo(data, field)}
    </div>
    `;

const baseFields = {
    primary,
    text,
    email: input,
    password,
    wysiwyg,
    hidden,
    textarea,
    select,
    file,
    checkboxes,
    radios,
    checkbox
};

const noInputLabelFields = Object.assign({}, baseFields);

noInputLabelFields.text = (field, modelType, data) => {
    let value = defaultValue(field.id, field.default)(data);
    return `<input type="${field.type}" 
        id="${modelType}__${field.id}" 
        name="${modelType}__${field.id}" 
        ${value ? 'value="' + value + '"' : ''}
        placeholder="${typeof field.label != 'undefined' ? field.label : capitalize(field.id)}"
        ${isValue(field, 'required') ? 'required' : ''}
        />
    `;
}

const fieldsCls = (fields, modelType, data) => field => {
    return typeof fields[field.type] !== 'undefined' ? fields[field.type](field, modelType, data) : "<!-- Error: field.type not found for ${field.id} of ${modelType} -->";
}


export {
    baseFields,
    fieldsCls,
    noInputLabelFields
}