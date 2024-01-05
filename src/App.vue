<script setup>
import OneHeader from "@/layout/header/OneHeader.vue";
import animationNewYear from "@/assets/animations/animationNewYear.vue";
import { ref } from "vue";

const logOut = ref();

function userEvent(value) {
  logOut.value = value;
}

</script>

<template>
  <OneHeader @userEvent="userEvent" />
  <animationNewYear />
  <RouterView :logOutEvent="logOut" />
</template>

<style lang="sass">
@import "@/assets/css/style.sass"
</style>
