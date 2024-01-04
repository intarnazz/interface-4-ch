<script setup>
import { loginPOST } from "@/api/api.js";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import Cropper from "cropperjs";

const API_URL = import.meta.env.VITE_API_URL;
const $route = useRoute();
const root = ref(false);
const login = ref("");
const subscribers = ref(0);
const customizeMod = ref(false);

onMounted(async () => {
  login.value = localStorage.getItem("user");
  if ($route.params.login !== login.value) {
    root.value = false;
  } else {
    const pasword = localStorage.getItem("pasword");
    try {
      const code = await loginPOST(login.value, pasword);
      if (code === 200) {
        root.value = true;
      } else {
        root.value = false;
      }
    } catch (e) {
      console.log(e);
    }
  }
});
function customizeModEvent() {
  if (!customizeMod.value) {
    customizeMod.value = true;
  } else {
    customizeMod.value = false;
  }
}
</script>

<template>
  <section class="profile">
    <header class="profile__header">
      <div v-if="customizeMod" class="profile__customize-header customize">
        <span class="material-symbols-outlined photo_camera">
          photo_camera
        </span>
      </div>
      <img
        class="profile__header-img"
        src="@/assets/img/ProfileHeaderDefaut.jpg"
        alt=""
      />
    </header>
    <main class="profile__main">
      <div class="profile__ava-wrapper">
        <div v-if="customizeMod" class="profile__customize-ava customize">
          <span class="material-symbols-outlined photo_camera">
            photo_camera
          </span>
        </div>
        <img
          :src="`${API_URL}profileImage/${login}`"
          alt=""
          class="profile__ava"
        />
      </div>
      <div class="profile__info">
        <h2 class="profile__user-name">{{ login }}</h2>
        <div class="profile__sub">
          @{{ login }} &#8226; {{ subscribers }} subscribers
        </div>
        <div class="profile__about-user">
          More about this channel
          <span class="material-symbols-outlined"> chevron_right </span>
        </div>
        <div class="profile__button-wrapper">
          <button @click="customizeModEvent" class="profile__customize-profile">
            Customize profile
          </button>
        </div>
      </div>
    </main>
  </section>
</template>

<style lang="sass" scoped>
$headerImg: 200px
$avaSize: 160px
  
.customize
  position: relative
  background-color: $customize
  display: flex
  justify-content: center
  align-items: center
  cursor: pointer
  transition: .1s
.customize:hover
  background-color: $customizeHover
.profile
  display: flex
  flex-direction: column
  gap: 2em
  &__customize-profile
    background-color: $formPost
    padding: .5em 1.2em
    border-radius: 1em
    transition: .1s
  &__customize-profile:hover
    background-color: $subBgColorHover
  &__header
    display: flex
    flex-direction: column
  &__header-img
    height: $headerImg
    border-radius: 1em
    object-fit: cover
  &__ava
    height: $avaSize
    width: $avaSize
    border-radius: $avaSize
    object-fit: cover
  &__main
    display: flex
    gap: 2em
  &__info
    color: $greyText
    display: flex
    flex-direction: column
    gap: 1em
  &__user-name
    font-size: 2.3em
    color: $textColor
  &__about-user
    display: flex
    align-items: center
  &__customize-header
    height: $headerImg
    border-radius: 1em
    margin-bottom: -$headerImg
  &__customize-ava
    height: $avaSize
    width: $avaSize
    border-radius: $avaSize
    margin-bottom: -$avaSize

.photo_camera
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24
  font-size: 4em
</style>
