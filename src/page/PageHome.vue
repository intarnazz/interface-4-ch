<script setup>
import { onMounted, ref } from "vue";

const API_URL = "http://127.0.0.1:5000/";
const arr = ref(null);

onMounted(async () => {
  await fetch(`${API_URL}api`)
    .then((response) => response.json())
    .then((json) => {
      arr.value = json.data;
    });
  console.log(arr.value);
});
</script>

<template>
  <main class="main">
    <section class="video-section">
      <div
        v-for="(item, id) in arr"
        :key="id"
        class="video-section__item-wrapper"
      >
        <RouterLink :to="{ name: 'Video', params: { id: id } }">
          <video
            :src="`${API_URL}image/${id}?tred=video_api`"
            class="video-section__item"
          ></video>
          <p class="video-section__item-name">
            {{ item.name }}
          </p>
        </RouterLink>
      </div>
    </section>
  </main>
</template>

<style>
@import "@/assets/css/style.sass";
</style>
