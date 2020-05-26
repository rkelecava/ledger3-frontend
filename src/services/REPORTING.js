import API from '@/services/API'

export default {
    getAllCategories (id) {
        return API().get('reporting/allCategories/' + id)
    }
}