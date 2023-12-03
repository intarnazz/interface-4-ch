<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const API_URL = "http://127.0.0.1:5000/";
const arr = ref(null);
const arrAside = ref(null);
const $route = useRoute();
const loding = ref(true);

onMounted(async () => {
  await fetch(`${API_URL}api/${$route.params.id}`)
    .then((response) => response.json())
    .then((json) => {
      arr.value = json.data;
    });
  console.log(arr.value);
  console.log(arr.value);
  await fetch(`${API_URL}api`)
    .then((response) => response.json())
    .then((json) => {
      arrAside.value = json.data;
    });
  console.log(arr.value);
  console.log(arr.value);
  loding.value = false;
});
</script>

<template>
  <template v-if="!loding">
    <section class="main-video-section">
      <div class="video-wrapper">
        <video
          :src="`${API_URL}image/${$route.params.id}?tred=video_api`"
          class="video"
          controls
          autoplay
        ></video>
        <p class="video__name">
          {{ arr[$route.params.id].name }}
        </p>
      </div>
      <section class="video-section">
        <RouterLink
          :to="{ name: 'Video', params: { id: id } }"
          v-for="(item, id) in arrAside"
          :key="id"
          class="video-section__item-wrapper"
        >
          <video
            :src="`${API_URL}image/${id}?tred=video_api`"
            class="video-section__item"
          ></video>
          <p class="video-section__item-name">
            {{ item.name }}
          </p>
        </RouterLink>
      </section>
    </section>
  </template>
</template>

<style lang="sass" scoped>

.video-section
  flex-direction: column
  &__item
    width: 168px
    height: 94px
  &__item-wrapper
    display: flex
    gap: 1em
    border-radius: 10px
  &__item-name
    font-size: 14px
    white-space: pre-wrap
    
.main-video-section
  display: flex
  gap: 1em
</style>
