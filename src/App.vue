<script setup>
import OneHeader from "@/layout/header/OneHeader.vue";
import animationNewYear from "@/assets/animations/animationNewYear.vue";
</script>

<template>
  <OneHeader />
  <animationNewYear />
  <RouterView :logOutEvent="logOutEvent" />
</template>

<style lang="sass">
@import "@/assets/css/style.sass"
</style>
