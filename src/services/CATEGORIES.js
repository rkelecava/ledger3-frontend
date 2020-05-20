import API from '@/services/API'

var token = 'Bearer ' + localStorage.authToken

export default {
    getAll (id) {
        return API().get('categories/' + id, { headers: {Authorization: token }})
    },
    add (id, payload) {
        return API().post('categories/add/' + id, payload, { headers: {Authorization: token }})
    },
    deleteOne (user, category) {
        return API().delete('categories/delete/' + user + '/' + category, { headers: {Authorization: token }})
    },
    getOne (category) {
        return API().get('categories/getOne/' + category, { headers: {Authorization: token }})
    },
    update (category, payload) {
        return API().put('categories/update/' + category, payload, { headers: {Authorization: token }})
    }
}