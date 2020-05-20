import API from '@/services/API'

var token = 'Bearer ' + localStorage.authToken

export default {
    getAll (id) {
        return API().get('accounts/' + id, { headers: {Authorization: token }})
    },
    add (id, payload) {
        return API().post('accounts/add/' + id, payload, { headers: {Authorization: token }})
    },
    deleteOne (user, account) {
        return API().delete('accounts/delete/' + user + '/' + account, { headers: {Authorization: token }})
    },
    getOne (account) {
        return API().get('accounts/getOne/' + account, { headers: {Authorization: token }})
    },
    update (account, payload) {
        return API().put('accounts/update/' + account, payload, { headers: {Authorization: token }})
    }
}