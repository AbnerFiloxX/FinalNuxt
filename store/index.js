export const state = () => ({
    newUser: false
})

export const mutations = {
    setNewUser(state, newUser) {
        console.log('@@@ mutation =>',newUser)
        state.newUser = newUser
    }
}

