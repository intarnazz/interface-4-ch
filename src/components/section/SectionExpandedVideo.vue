<script setup>
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { videoGET } from "@/api/api.js";
import SectionVideoAside from "@/components/section/SectionVideoAside.vue";
import SectionComents from "@/components/section/SectionComents.vue";
import ComponentUserReact from "@/components/ComponentUserReact.vue";
import ComponentDescription from "@/components/ComponentDescription.vue";

const props = defineProps(["logOutEvent"]);

const API_URL = import.meta.env.VITE_API_URL;
const arr = ref();
const $route = useRoute();
const loding = ref(true);
const errorServerNotFound = ref(false);
const massageOpacity = ref(0);

async function fetchData() {
  try {
    loding.value = true;
    arr.value = await videoGET($route.params.id, "ById");
    console.log(arr.value);
    loding.value = false;
  } catch (e) {
    errorServerNotFound.value = true;
    loding.value = false;
  }
}

onMounted(async () => {
  await fetchData();
});

const videoName = computed(() => {
  return arr.value[$route.params.id]
    ? arr.value[$route.params.id].name
    : "Video Not Found";
});

function copyToClipboard() {
  navigator.clipboard
    .writeText(window.location.origin + $route.fullPath)
    .then(() => {
      massageOpacity.value = 10;
      let intervalId = setInterval(() => {
        massageOpacity.value++;
        if (massageOpacity.value === 99) {
          clearInterval(intervalId);
          intervalId = setInterval(() => {
            massageOpacity.value--;
            if (massageOpacity.value === 11) {
              massageOpacity.value = 0;
              clearInterval(intervalId);
            }
          }, 11);
        }
      }, 11);
    })
    .catch((e) => {
      console.log(e);
    });
}

watch(() => $route.params.id, fetchData);
</script>

<template>
  <template v-if="!loding">
    <section class="main-video-section">
      <div class="video-wrapper">
        <main class="main">
          <div v-if="errorServerNotFound" class="errorServerNotFound">
            <img
              src="@/assets/img/gif/eto-anime-girl.gif"
              alt="errorServerNotFound"
            />
          </div>
          <video
            v-else
            :src="`${API_URL}api/videoById/${$route.params.id}`"
            class="video"
            controls
            autoplay
            loop="-1"
          ></video>
          <div class="video-wrapper__video-info">
            <div class="video-wrapper__sup-text">
              <h2 class="video__name">
                {{ videoName }}
              </h2>
            </div>
            <div class="video-wrapper__sub-text">
              <RouterLink
                :to="{
                  name: 'Profile',
                  params: { login: arr[$route.params.id].autor },
                }"
                class="video-section__item-wrapper"
              >
                <div class="autor">
                  <img
                    class="autor__ava"
                    :src="`${API_URL}api/profileImage/${
                      arr[$route.params.id].autor
                    }`"
                    alt=""
                  />
                  <div class="autor__info">
                    <h3 class="autor__name">
                      {{ arr[$route.params.id].autor }}
                    </h3>
                    <div class="autor__sub">0 subscribers</div>
                  </div>
                </div>
              </RouterLink>
              <div class="video-wrapper__buttons">
                <ComponentUserReact />
                <button
                  @click="copyToClipboard()"
                  class="autor__sub-button-share button-share"
                >
                  <span class="material-symbols-outlined"> share </span>
                  Share
                  <div class="massage" :style="`opacity: .${massageOpacity}`">
                    URL скопирован в буфер обмена
                  </div>
                </button>
              </div>
            </div>
          </div>
          <hr />
          <ComponentDescription />
          <SectionComents :logOutEvent="props.logOutEvent" />
        </main>
      </div>
      <SectionVideoAside />
    </section>
  </template>
</template>

<style lang="sass" scoped>
.massage
  position: fixed
  top: 50px
  left: 40%
  padding: .5em 1em
  background-color: #464646
  border-radius: 20px
  box-shadow: 0px 0px 10px #000
  pointer-events: none

.button-share
  display: flex
  align-items: center
  gap: .3em
  padding: .5em 1em
  border-radius: 20px
  background-color: $subBgColor


.main
  display: flex
  flex-direction: column
.autor
  display: flex
  align-items: center
  gap: 1em
  &__ava
    width: 40px
    height: 40px
    border-radius: 40px
    object-fit: cover
  &__sub
    color: $greyText
  &__name
    font-size: 1em
.video-wrapper
  flex: 2.3
  &__video-info
    display: flex
    flex-direction: column
    gap: .5em
    margin-top: .5em
  &__sup-text
    padding-left: .2em
    display: flex
    justify-content: space-between
    align-items: flex-start
  &__sub-text
    display: flex
    justify-content: space-between
  &__buttons
    display: flex
    gap: .5em

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
