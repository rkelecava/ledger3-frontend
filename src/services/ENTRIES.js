import API from '@/services/API'

export default {
    getAll (id, skip, limit) {
        return API().get('entries/' + id + '/' + skip + '/' + limit)
    },
    add (id, payload) {
        return API().post('entries/add/' + id, payload)
    },
    deleteOne (account, entry) {
        return API().delete('entries/delete/' + account + '/' + entry)
    },
    getOne (entry) {
        return API().get('entries/getOne/' + entry)
    },
    update (entry, payload) {
        return API().put('entries/update/' + entry, payload)
    }
}