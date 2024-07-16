import { defineStore } from 'pinia'

const usetabbar = defineStore('tabbar', {
    state() {
        return {
            active: "home",
        }
    },
    getters: {
        getActive: (state) => state.active,
    },
    actions: {
        setActive(active: string) {
            this.active = active
        },
    },
})

export default usetabbar