<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { videoGET, likeGET } from "@/api/api.js";

const arr = ref(null);
const $route = useRoute();
const like = ref(0);
const dislike = ref(0);
const likeClickActiv = ref(false);
const dislikeClickActiv = ref(false);

async function fetchData() {
  likeClickActiv.value = false;
  dislikeClickActiv.value = false;
  arr.value = await videoGET($route.params.id, "ById");
  like.value = arr.value[$route.params.id].like ?? 0;
  dislike.value = arr.value[$route.params.id].dislike ?? 0;
}

onMounted(async () => {
  await fetchData();
});

const likeFix = computed(() => {
  return like.value >= 1000000000
    ? (like.value / 1000000000).toFixed(1) + "M"
    : like.value >= 1000
      ? (like.value / 1000).toFixed(1) + "K"
      : like.value;
});

const dislikeFix = computed(() => {
  return dislike.value >= 1000000000
    ? (dislike.value / 1000000000).toFixed(1) + "M"
    : dislike.value >= 1000
      ? (dislike.value / 1000).toFixed(1) + "K"
      : dislike.value;
});

async function likeClick() {
  if (dislikeClickActiv.value) {
    --dislike.value;
    ++like.value;
    dislikeClickActiv.value = false;
    likeClickActiv.value = true;

    await likeGET($route.params.id, -1, "dis_like");
    await likeGET($route.params.id, 1, "like");
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

    await likeGET($route.params.id, delta, "like");
  }
}

async function dislikeClick() {
  if (likeClickActiv.value) {
    --like.value;
    ++dislike.value;
    dislikeClickActiv.value = true;
    likeClickActiv.value = false;
    await likeGET($route.params.id, -1, "like");
    await likeGET($route.params.id, 1, "dis_like");
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

    await likeGET($route.params.id, delta, "dis_like");
  }
}
</script>

<template>
  <div class="video__reaction reaction">
    <div @click="likeClick()" class="reaction__like">
      <span class="material-symbols-outlined" :class="{ reaction__like_activ: likeClickActiv }">
        thumb_up </span>{{ likeFix }}
    </div>
    <div style="border-left: 1px rgba(255, 255, 255, 0.4) solid; height: 1.5em" class="line"></div>
    <div @click="dislikeClick()" class="reaction__dislike">
      <span class="material-symbols-outlined" :class="{ reaction__dislike_activ: dislikeClickActiv }">
        thumb_down </span>{{ dislikeFix }}
    </div>
    <div class="reaction__delta">
      <div :style="`flex: ${like};`" class="reaction__delta_like"></div>
      <div :style="`flex: ${dislike};`" class="reaction__delta_dislike"></div>
    </div>
  </div>
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
      transition: 1s
      border-top: 1px rgba(255, 255, 255, 0.87) solid
    &_dislike
      transition: 1s
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
</style>
