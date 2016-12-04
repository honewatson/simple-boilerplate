import {html} from '../../utils';

export default model => html`
        <p>${model.content}</p>
        <label for="alerter">
            Alerter
            <input name="alerter" id="alerter" type="submit" onclick="return ev(this, 'alert')" data-message="Hello Galaxy Guardians" />
        </label>
        <p id="content__story">${model.story}</p>
        <input type="text" onblur="return ev(this, 'updateImmute')" data-immute="content.story"  />
        
    `;