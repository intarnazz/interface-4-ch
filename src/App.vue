<script setup>

// [] сделать коменты
// [] login user

import { onMounted, ref } from "vue";

const API_URL = "http://127.0.0.1:5000/";
const arr = ref(null);

onMounted(async () => {
  await fetch(`${API_URL}api`)
    .then((response) => response.json())
    .then((json) => {
      arr.value = json.data;
    });
});
</script>

<template>
  <header class="header">
    <div>
      <RouterLink :to="{ name: 'Home' }">
        <img src="/vite.svg" class="logo" alt="Vite logo" />
      </RouterLink>
    </div>
  </header>
  <RouterView />
</template>

<style>
@import "@/assets/css/style.sass";
</style>
