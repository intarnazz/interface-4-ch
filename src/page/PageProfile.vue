<script setup>
import { useRoute } from "vue-router";
const $route = useRoute();
</script>

<template>
  <h1>
    {{ $route.params.login }}
  </h1>
</template>

<style lang="sass" scoped></style>
