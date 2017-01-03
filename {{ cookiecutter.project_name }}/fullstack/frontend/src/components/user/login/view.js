import {baseFields as fields} from '../../crud/fields';

export default obj => {
    let {username, password, csrf_token} = obj.model;
    return `
        <div class="g--12 animated fadeIn">
            <div class="card">       
                <div class="g--12 cb">
                ${fields.text(username, obj.model.type, obj.data)}
                ${fields.password(password, obj.model.type, obj.data)}
                ${fields.hidden(csrf_token, obj.model.type, obj.data)}
                </div>
                <p><a href="javascript:void(0)" onclick="return ev('/user/forgot-password', 'route')">Forgot Password</a></p>
                <div class="g--12 cb">
                    <button class="btn--blue btn--raised" onclick="return ev({model:'user_login', route: '/admin/content/list'}, 'postRedirect')" type="submit" id="submit" name="submit">
                        Submit
                    </button>                
                </div>
            </div>
        </div>
    `;
}
