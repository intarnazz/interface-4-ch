<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { videoGET } from "@/api/api.js";
import SectionVideoAside from "@/components/section/SectionVideoAside.vue";
import SectionComents from "@/components/section/SectionComents.vue";
import ComponentUserReact from "@/components/ComponentUserReact.vue";
import ComponentDescription from "@/components/ComponentDescription.vue";

const API_URL = import.meta.env.VITE_API_URL;
const arr = ref(null);
const $route = useRoute();
const loding = ref(true);

async function fetchData() {
  loding.value = true;
  arr.value = await videoGET($route.params.id);
  loding.value = false;
}

onMounted(async () => {
  await fetchData();
});
watch(() => $route.params.id, fetchData);
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
          loop="-1"
        ></video>
        <div class="video-wrapper__sup-text">
          <h2 class="video__name">
            {{ arr[$route.params.id].name }}
          </h2>
          <ComponentUserReact />
        </div>
        <hr />
        <ComponentDescription />
        <SectionComents />
      </div>
      <SectionVideoAside />
    </section>
  </template>
</template>

<style lang="sass" scoped>
.video-wrapper
  flex: 2.3
  &__sup-text
    padding-left: .2em
    display: flex
    justify-content: space-between
    align-items: flex-start
    margin: .5em 2em 0 0
.video
  width: 100%
  max-height: 70vh
  border-radius: 20px
  &__name
    line-height: normal
    font-size: 1.4em
    font-weight: 500

.main-video-section
  display: flex
  gap: 1em
</style>
