<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { videoGET } from "@/api/api.js";

const API_URL = import.meta.env.VITE_API_URL;
const arrAside = ref(null);
const $route = useRoute();
const loding = ref(true);
const errorServerNotFound = ref(false);

async function fetchData() {
  try {
    loding.value = true;
    arrAside.value = await videoGET();
    loding.value = false;
  } catch (e) {
    errorServerNotFound.value = true;
  }
}

onMounted(async () => {
  await fetchData();
});
</script>

<template>
  <section class="video-section">
    <template v-if="!loding">
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
    </template>
    <template v-else>
      <n-space v-for="key in 10" :key="key" vertical>
        <n-skeleton
          style="
            --n-color-start: rgba(255, 255, 255, 0.12);
            --n-color-end: rgba(255, 255, 255, 0.18);
          "
          class="video-section__item"
        />
      </n-space>
    </template>
  </section>
</template>

<style lang="sass" scoped>

.video-section
  display: flex
  flex: 1
  flex-direction: column
  gap: 1em
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
    object-fit: cover
    border-radius: 10px
    background-color: $subBgColor
</style>
