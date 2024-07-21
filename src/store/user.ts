import { defineStore } from 'pinia'

const useUserStore = defineStore('login', {
    state() {
        return {
            token: "",
            username: "",
            avatar: "",
            teststr: '测试数据',
        }
    },
    actions: {
        getUserInfo() {
            return {
                token: this.token,
                username: this.username,
                avatar: this.avatar,
                teststr: this.teststr
            }
        },
        setStr(newStr: string) {
            this.teststr = newStr
        },
    },
})

export default useUserStore
