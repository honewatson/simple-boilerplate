export const forgotInitButton = obj => `
    <button class="btn--blue btn--raised" onclick="return ev({model:'user_forgot_init', route: '/content/3'}, 'postRedirect')" type="submit" id="submit" name="submit">
        Submit
    </button>`

export const forgotButton = obj => `
    <button class="btn--blue btn--raised" onclick="return ev({model:'user_forgot', route: '/content/4'}, 'postRedirect')" type="submit" id="submit" name="submit">
        Submit
    </button>`
