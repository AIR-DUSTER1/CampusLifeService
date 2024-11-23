<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app"
import usePlatform from '@/store/platform'
const app = usePlatform()
let platform = uni.$u.platform
onLaunch(() => {
  app.setPlatform(platform)
  console.log("App Launch")
});
onShow(() => {
  console.log("App Show")
  uni.hideTabBar({
    animation: false
  })
});
onHide(() => {
  console.log("App Hide")
});
</script>

<style lang="scss">
</style>
