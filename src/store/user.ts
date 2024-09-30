import { defineStore } from 'pinia'
import logo from '@/static/logo.png'
const useUserStore = defineStore('user', {
    state() {
        return {
            token: "",
            username: "",
            number: '',
            email: '',
            phone: '',
            sex: '',
            idNumber: '',
            avatar: logo,
            uid: 0,
            roles: ['']
        }
    },
    getters: {
        userinfo: (state) => state,
    },
    actions: {
        saveUserInfo(data) {
            this.username = data.username
            this.avatar = data.avatar || logo
            this.uid = data.uid
            this.number = data.number
            this.phone = data.phone
            this.email = data.email
            this.idNumber = data.idNumber
            this.sex = data.sex
            this.roles = data.roles
        },
        setUid(uid: number) {
            this.uid = uid
        },
        setAvatar(avatar: string) {
            this.avatar = avatar
        },
        setSex(sex: string) {
            this.sex = sex
        }
    },
})

export default useUserStore
