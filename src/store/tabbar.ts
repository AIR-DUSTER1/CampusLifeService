import { defineStore } from 'pinia'

const usetabbar = defineStore('tabbar', {
    state() {
        return {
            active: "home",
            badge:0
        }
    },
    getters: {
        getActive: (state) => state.active,
        getBadge: (state) => state.badge,
    },
    actions: {
        setActive(active: string) {
            this.active = active
        },
        setBadge(badge: number){
            this.badge = badge
        }
    },
})

export default usetabbar