import { defineStore } from 'pinia'

const usePlatform = defineStore('platform', {
    state() {
        return {
            platform: "",
        }
    },
    getters: {
        getPlatform: (state) => state.platform,
    },
    actions: {
        setPlatform(platform: string) {
            this.platform = platform
        },
    },
})

export default usePlatform