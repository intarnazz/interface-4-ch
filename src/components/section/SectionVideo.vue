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
      <RouterLink :to="{ name: 'ExpandedVideo', params: { id: id } }">
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

<style lang="sass" scoped>
.video-section
  display: flex
  gap: 1em
  flex-wrap: wrap
  &__item
    width: 322px
    height: 175px
    border-radius: 10px
    object-fit: cover
  &__item-wrapper
    border-radius: 10px
  &__item-name
    width: 322px
    white-space: nowrap
    font-size: 1em
    font-weight: 500
    overflow: hidden
    text-overflow: ellipsis

</style>
