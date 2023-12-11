<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { videoGET } from "@/api/api.js";

const API_URL = import.meta.env.VITE_API_URL;
const arrAside = ref(null);
const $route = useRoute();

async function fetchData() {
  arrAside.value = await videoGET();
}

onMounted(async () => {
  await fetchData();
});
</script>

<template>
  <section class="video-section">
    <template v-for="(item, id) in arrAside" :key="id">
      <RouterLink
        v-if="id !== $route.params.id"
        :to="{ name: 'ExpandedVideo', params: { id: id } }"
        class="video-section__item-wrapper"
      >
        <video
          :src="`${API_URL}image/${id}?tred=video_api`"
          class="video-section__item"
          preload="metadata"
        ></video>
        <p class="video-section__item-name">
          {{ item.name }}
        </p>
      </RouterLink>
    </template>
  </section>
</template>

<style lang="sass" scoped>

.video-section
  flex: 1
  flex-direction: column
  &__item-wrapper
    display: flex
    gap: 1em
    border-radius: 10px
  &__item-name
    height: 94px
    width: auto
    font-size: 14px
    font-weight: 400
    line-height: 1.4em
    flex: 1
    white-space: normal
  &__item
    width: 168px
    height: 94px
</style>
