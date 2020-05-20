import API from '@/services/API'

export default {
    saveToken (token) {
        localStorage.authToken = token
    },
    getToken () {
        return localStorage.authToken
    },
    isLoggedIn () {
        var token = this.getToken()
        if (token) {
            var payload = JSON.parse(atob(token.split('.')[1]))
            return payload.exp > Date.now() / 1000
        } else {
            return false
        }
    },
    currentUser () {
        if (this.isLoggedIn()) {
            var token = this.getToken()
            var payload = JSON.parse(atob(token.split('.')[1]))

            return payload
        }
    },
    register (user) {
        return API().post('auth/register', user)
    },
    login (user) {
        return API().post('auth/login', user)
    },
    logout () {
        localStorage.removeItem('authToken')
    },
    requestPasswordReset (payload) {
        return API().post('auth/request-password-reset', payload)
    },
    resetPassword (payload) {
        return API().post('auth/reset-password', payload)
    }
} 