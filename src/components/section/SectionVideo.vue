<script setup>
import { onMounted, ref } from "vue";
import { videoGET } from "@/api/api.js";

const API_URL = import.meta.env.VITE_API_URL;
const arr = ref(null);

onMounted(async () => {
  arr.value = await videoGET();
});
</script>

<template>
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
          preload="metadata"
        ></video>
        <p class="video-section__item-name">
          {{ item.name }}
        </p>
      </RouterLink>
    </div>
  </section>
</template>

<style lang="sass">
@import "@/assets/css/style.sass"
</style>
