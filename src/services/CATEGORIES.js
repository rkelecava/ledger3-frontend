import API from '@/services/API'

export default {
    getAll (id) {
        return API().get('categories/' + id)
    },
    add (id, payload) {
        return API().post('categories/add/' + id, payload)
    },
    deleteOne (user, category) {
        return API().delete('categories/delete/' + user + '/' + category)
    },
    getOne (category) {
        return API().get('categories/getOne/' + category)
    },
    update (category, payload) {
        return API().put('categories/update/' + category, payload)
    }
}