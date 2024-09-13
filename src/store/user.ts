import { defineStore } from 'pinia'
import logo from '@/static/logo.png'
const useUserStore = defineStore('login', {
    state() {
        return {
            token: "",
            username: "",
            number: '',
            email: '',
            phone: '',
            idNumber: '',
            avatar: logo,
            uid: 0,
            authorities: ['']
        }
    },
    getters: {
        userinfo: (state) => state,
    },
    actions: {
        getUserInfo() {
            return {
                token: this.token,
                username: this.username,
                avatar: this.avatar,
                uid: this.uid
            }
        },
        saveUserInfo(data) {
            this.token = data.access_token
            this.username = data.username
            this.avatar = data.avatar || logo
            this.uid = data.uid
        },
    },
})

export default useUserStore
