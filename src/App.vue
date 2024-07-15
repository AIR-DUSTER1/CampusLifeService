<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app"
import usePlatform from '@/store/platform'
let platform = uni.$u.platform
const app = usePlatform()
onLaunch(() => {
  app.setPlatform(platform)
  console.log("App Launch");
});
onShow(() => {
  console.log("App Show");
  uni.hideTabBar({
    animation: false
  })
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style lang="scss">
@import "uview-plus/index.scss";
</style>
