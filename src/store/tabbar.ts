import { defineStore } from 'pinia'

const usetabbar = defineStore('tabbar', {
    state() {
        return {
            active: 0,
        }
    },
    getters: {
        getActive: (state) => state.active,
    },
    actions: {
        setActive(active: number) {
            this.active = active
        },
    },
})

export default usetabbar