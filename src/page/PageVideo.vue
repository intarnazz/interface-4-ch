<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const API_URL = "http://127.0.0.1:5000/";
const arr = ref(null);
const arrAside = ref(null);
const $route = useRoute();
const loding = ref(true);

async function fetchData() {
  loding.value = true
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
  console.log(Object.entries(arrAside.value));
  loding.value = false;
}

onMounted(async () => {
  fetchData()
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
        <div class="video-wrapper__sub-text">
          <p class="video__name">
            {{ arr[$route.params.id].name }}
          </p>
          <div class="video-wrapper__description">
            <p>описание:</p>
            <br />
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquid
              voluptate sequi, magni quis dicta veritatis voluptatum
              reprehenderit deleniti, id optio praesentium, aut ut consectetur
              necessitatibus nulla porro asperiores eos laboriosam?
            </p>
          </div>
        </div>
      </div>
      <section class="video-section">
        <template v-for="(item, id) in arrAside" :key="id">
          <RouterLink
            v-if="id !== $route.params.id"
            :to="{ name: 'Video', params: { id: id } }"
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
        </template>
      </section>
    </section>
  </template>
</template>

<style lang="sass" scoped>
.video-wrapper
  width: 940px
  &__sub-text
    padding-left: .2em
  &__description
    padding: 1em
    background-color: $subBgColor
    border-radius: 10px
.video
  width: 940px
  max-height: 529px
  border-radius: 20px
  &__name
    line-height: normal
    font-size: 1.4em
    line-height: 2em
    font-weight: 500

.video-section
  flex-direction: column
  &__item-wrapper
    display: flex
    gap: 1em
    border-radius: 10px
  &__item-name
    width: 260px
    font-size: 14px
    white-space: pre-wrap
  &__item
    width: 168px
    height: 94px

.main-video-section
  display: flex
  gap: 1em
</style>
