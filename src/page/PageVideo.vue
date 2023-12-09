<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const API_URL = "http://127.0.0.1:5000/";
const arr = ref(null);
const arrAside = ref(null);
const $route = useRoute();
const loding = ref(true);
const like = ref(0);
const dislike = ref(0);
const likeClickActiv = ref(false);
const dislikeClickActiv = ref(false);

async function fetchData() {
  loding.value = true;
  likeClickActiv.value = false;
  dislikeClickActiv.value = false;
  await fetch(`${API_URL}api/${$route.params.id}`)
    .then((response) => response.json())
    .then((json) => {
      arr.value = json.data;
    });
  like.value = arr.value[$route.params.id].like ?? 0;
  dislike.value = arr.value[$route.params.id].dislike ?? 0;
  await fetch(`${API_URL}api`)
    .then((response) => response.json())
    .then((json) => {
      arrAside.value = json.data;
    });
  loding.value = false;
}

onMounted(async () => {
  await fetchData();
});

const likeFix = computed(() => {
  return like.value >= 1000 ? (like.value / 1000).toFixed(1) + "K" : like.value;
});

const dislikeFix = computed(() => {
  return dislike.value >= 1000
    ? (dislike.value / 1000).toFixed(1) + "K"
    : dislike.value;
});

async function likeClick() {
  if (dislikeClickActiv.value) {
    --dislike.value;
    ++like.value;
    dislikeClickActiv.value = false;
    likeClickActiv.value = true;
    await fetch(
      `${API_URL}api/like/${$route.params.id}?delta=-1&event=dislike`
    );
    await fetch(`${API_URL}api/like/${$route.params.id}?delta=1&event=like`);
  } else {
    let delta;
    if (!likeClickActiv.value) {
      likeClickActiv.value = true;
      delta = 1;
    } else {
      likeClickActiv.value = false;
      delta = -1;
    }
    like.value = like.value + delta;
    await fetch(
      `${API_URL}api/like/${$route.params.id}?delta=${delta}&event=like`
    );
  }
}

async function dislikeClick() {
  if (likeClickActiv.value) {
    --like.value;
    ++dislike.value;
    dislikeClickActiv.value = true;
    likeClickActiv.value = false;
    await fetch(`${API_URL}api/like/${$route.params.id}?delta=-1&event=like`);
    await fetch(`${API_URL}api/like/${$route.params.id}?delta=1&event=dislike`);
  } else {
    let delta;
    if (!dislikeClickActiv.value) {
      dislikeClickActiv.value = true;
      delta = 1;
    } else {
      dislikeClickActiv.value = false;
      delta = -1;
    }
    dislike.value = dislike.value + delta;
    await fetch(
      `${API_URL}api/like/${$route.params.id}?delta=${delta}&event=dislike`
    );
  }
}

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
          <p class="video__name">
            {{ arr[$route.params.id].name }}
          </p>
          <div class="video__reaction reaction">
            <div @click="likeClick()" class="reaction__like">
              <span
                class="material-symbols-outlined"
                :class="{ reaction__like_activ: likeClickActiv }"
              >
                thumb_up </span
              >{{ likeFix }}
            </div>
            <div
              style="
                border-left: 1px rgba(255, 255, 255, 0.4) solid;
                height: 1.5em;
              "
              class="line"
            ></div>
            <div @click="dislikeClick()" class="reaction__dislike">
              <span
                class="material-symbols-outlined"
                :class="{ reaction__dislike_activ: dislikeClickActiv }"
              >
                thumb_down </span
              >{{ dislikeFix }}
            </div>
            <div class="reaction__delta">
              <div :style="`flex: ${like};`" class="reaction__delta_like"></div>
              <div :style="`flex: ${dislike};`" class="reaction__delta_dislike"></div>
            </div>
          </div>
        </div>
        <hr />
        <div class="video-wrapper__sub-text">
          <div class="video-wrapper__description">
            <p>
              ✅Lorem ipsum, dolor sit amet consectetur,<br />
              ✅adipisicing elit. Aliquid,<br />
              ✅voluptate sequi, magni quis dicta veritatis voluptatum.<br />
              reprehenderit deleniti, id optio praesentium. Aut ut consectetur
              necessitatibus nulla porro asperiores eos laboriosam? Lorem ipsum
              dolor sit amet consectetur adipisicing elit. Atque asperiores
              accusamus a minima, nemo eligendi. Atque, dolore iure. Suscipit,
              asperiores? Sapiente nihil voluptatum labore, veniam ullam facere
              consectetur ut doloremque?
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
              preload="metadata"
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

.material-symbols-outlined
  font-variation-settings: 'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 24

.reaction
  position: relative
  user-select: none
  cursor: pointer
  background: $subBgColor
  border-radius: 20px
  display: flex
  align-items: center
  font-weight: 700
  &__delta
    position: absolute
    width: 78%
    height: 1px
    bottom: -5px
    left: 11%
    display: flex
    &_like
      border-top: 1px rgba(255, 255, 255, 0.87) solid
    &_dislike
      border-top: 1px rgba(255, 255, 255, 0.3) solid
  &__like
    display: flex
    align-items: center
    gap: .3em
    padding: .5em 1em
    &_activ
      font-variation-settings: 'FILL' 1, 'wght' 200
  &__dislike
    padding: .5em 1em
    gap: .3em
    display: flex
    align-items: center
    &_activ
      font-variation-settings: 'FILL' 1, 'wght' 200
.video-wrapper
  flex: 2.3
  &__sup-text
    padding-left: .2em
    display: flex
    justify-content: space-between
    align-items: flex-start
    margin: .5em 2em 0 0
  &__sub-text
    line-height: 1.4em
  &__description
    padding: 1em
    background-color: $subBgColor
    border-radius: 10px
.video
  width: 100%
  max-height: 70vh
  border-radius: 20px
  &__name
    line-height: normal
    font-size: 1.4em
    line-height: 2em
    font-weight: 500

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

.main-video-section
  display: flex
  gap: 1em
</style>
