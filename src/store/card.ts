import { defineStore } from 'pinia'
const useCard = defineStore('card', {
    state() {
        return {
            carNo: 0,
            cardBalance: 0
        }
    },
    getters: {
        cardinfo: (state) => state
    },
    actions: {
        setCardInfo(cardinfo: any) {
            this.carNo = cardinfo.cardNo
            this.cardBalance = cardinfo.cardBalance
        }
    }
})
export default useCard