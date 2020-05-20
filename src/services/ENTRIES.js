import API from '@/services/API'

var token = 'Bearer ' + localStorage.authToken

export default {
    getAll (id, skip, limit) {
        return API().get('entries/' + id + '/' + skip + '/' + limit, { headers: {Authorization: token }})
    },
    add (id, payload) {
        return API().post('entries/add/' + id, payload, { headers: {Authorization: token }})
    },
    deleteOne (account, entry) {
        return API().delete('entries/delete/' + account + '/' + entry, { headers: {Authorization: token }})
    },
    getOne (entry) {
        return API().get('entries/getOne/' + entry, { headers: {Authorization: token }})
    },
    update (entry, payload) {
        return API().put('entries/update/' + entry, payload, { headers: {Authorization: token }})
    }
}