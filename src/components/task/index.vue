<template>
  <div>
    <router-view v-slot="{ Component }">
      <transition :name="$route.meta.transition || 'fade'">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>
<script>
export default {
  components: {},
  setup(){}
}
</script>
