import API from '@/services/API'

export default {
    getName () {
        return API().get('getName')
    }
}