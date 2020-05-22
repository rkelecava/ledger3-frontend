import API from '@/services/API'

export default {
    getAll (id) {
        return API().get('accounts/' + id)
    },
    add (id, payload) {
        return API().post('accounts/add/' + id, payload)
    },
    deleteOne (user, account) {
        return API().delete('accounts/delete/' + user + '/' + account)
    },
    getOne (account) {
        return API().get('accounts/getOne/' + account)
    },
    update (account, payload) {
        return API().put('accounts/update/' + account, payload)
    }
}