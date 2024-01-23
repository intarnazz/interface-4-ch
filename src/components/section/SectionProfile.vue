<script setup>
import { loginPOST } from "@/api/api.js";
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import Cropper from "cropperjs";
import SectionVideo from "@/components/section/SectionVideo.vue";

const API_URL = import.meta.env.VITE_API_URL;
const $route = useRoute();
const root = ref(false);
const login = ref("");
const password = ref("");
const subscribers = ref(0);
const customizeMod = ref(false);
const cropperOpen = ref(false);
const fileInput = ref(null);
const userAvaURL = ref(`${API_URL}profileImage/${$route.params.login}`);
const userHeaderURL = ref(`${API_URL}profileHeader/${$route.params.login}`);
const activImg = ref(null);

let cropper;

function windowEvent() {
  setTimeout(() => {
    console.log("addEventListener");
    if (cropperOpen.value) {
      cropperOpenEvent(true);
    }
  }, 10);
}

onMounted(async () => {
  console.log("onMounted - SectionProfile");
  login.value = localStorage.getItem("user");
  if ($route.params.login !== login.value) {
    root.value = false;
  } else {
    password.value = localStorage.getItem("pasword");
    console.log(password.value);
    try {
      const code = await loginPOST(login.value, password.value);
      if (code === 200) {
        root.value = true;
      } else {
        root.value = false;
      }
    } catch (e) {
      console.log("onMounted - ", e);
    }
  }
  window.addEventListener("resize", windowEvent);
});
onBeforeUnmount(() => {
  console.log("removeEventListener");
  window.removeEventListener("resize", windowEvent);
});
function customizeModEvent() {
  if (!customizeMod.value) {
    customizeMod.value = true;
  } else {
    customizeMod.value = false;
  }
}
async function userImgUpdate() {
  const croppedCanvas = await cropper.getCroppedCanvas();
  const blob = await new Promise((resolve) => {
    croppedCanvas.toBlob(resolve, "image/jpeg");
  });
  const formData = new FormData();
  if (activImg.value === "ava") {
    formData.append("ava", blob, "ava.jpg");
  } else {
    formData.append("ava", blob, "header.jpg");
  }
  formData.append("login", login.value);
  formData.append("password", password.value);

  fetch(`${API_URL}api/profileImageUpdade`, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
    })
    .catch((e) => {
      throw e;
    });
}
function cropperOpenEvent(bulen, idImage = "") {
  if (cropper) {
    cropper.destroy();
  }
  cropperOpen.value = bulen;
  if (bulen) {
    if (idImage) {
      activImg.value = idImage;
    }
    nextTick(() => {
      const image = document.getElementById(activImg.value);
      console.log(image);
      if (activImg.value == "ava") {
        cropper = new Cropper(image, {
          aspectRatio: 1 / 1,
          viewMode: 1,
          preview: ".preview",
          movable: false,
          zoomable: false,
        });
      } else {
        cropper = new Cropper(image, {
          viewMode: 1,
          preview: ".preview",
          movable: false,
          zoomable: false,
        });
      }
    });
  }
}

function openFileInput() {
  fileInput.value.value = null;
  fileInput.value.click();
}
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    if (activImg.value == "ava") {
      userAvaURL.value = URL.createObjectURL(file);
    } else {
      userHeaderURL.value = URL.createObjectURL(file);
    }
    nextTick(() => {
      console.log(activImg.value);
      if (activImg.value == "ava") {
        cropperOpenEvent(true, "ava");
      } else {
        cropperOpenEvent(true, "header");
      }
    });
  }
}
</script>

<template>
  <section class="profile">
    <header class="profile__header">
      <div
        v-if="customizeMod"
        @click="cropperOpenEvent(true, 'header')"
        class="profile__customize-header customize"
      >
        <span class="material-symbols-outlined photo_camera">
          photo_camera
        </span>
      </div>
      <img class="profile__header-img" :src="userHeaderURL" alt="" />
    </header>
    <main class="profile__main">
      <div class="profile__ava-wrapper">
        <div
          v-if="customizeMod"
          @click="cropperOpenEvent(true, 'ava')"
          class="profile__customize-ava customize"
        >
          <span class="material-symbols-outlined photo_camera">
            photo_camera
          </span>
        </div>
        <img :src="userAvaURL" alt="" class="profile__ava" />
      </div>
      <div class="profile__info">
        <h2 class="profile__user-name">{{ $route.params.login }}</h2>
        <div class="profile__sub">
          @{{ $route.params.login }} &#8226; {{ subscribers }} subscribers
        </div>
        <div class="profile__about-user">
          More about this channel
          <span class="material-symbols-outlined"> chevron_right </span>
        </div>
        <div class="profile__button-wrapper">
          <button
            v-if="root"
            @click="customizeModEvent"
            class="profile__customize-profile"
          >
            Customize profile
          </button>
        </div>
      </div>
    </main>
  </section>
  <div v-if="cropperOpen" class="popup popup-cropper">
    <div class="popup-cropper__preview">
      <div class="preview preview_1"></div>
      <div class="preview preview_2"></div>
      <div class="preview preview_3"></div>
    </div>
    <button
      @click="userImgUpdate"
      class="popup-cropper__button popup-cropper__button_upload"
    >
      Upload
    </button>
    <button
      @click="cropperOpenEvent(false)"
      class="popup-cropper__button popup-cropper__button_close"
    >
      Close
    </button>
    <input
      type="file"
      ref="fileInput"
      style="display: none"
      @change="handleFileUpload"
    />
    <button
      @click="openFileInput"
      class="popup-cropper__button popup-cropper__button_new-image"
    >
      New image
    </button>

    <div class="cropper-wrap-box">
      <div class="cropper-wrap-box__margin"></div>
      <div id="cropper-container" class="cropper-container">
        <img
          v-if="activImg === 'ava'"
          id="ava"
          class="popup-cropper__img"
          :src="userAvaURL"
          alt=""
        />
        <img
          v-if="activImg === 'header'"
          id="header"
          class="popup-cropper__img"
          :src="userHeaderURL"
          alt=""
        />
      </div>
      <div class="cropper-wrap-box__margin"></div>
    </div>
  </div>
  <hr />
  <SectionVideo :autor="$route.params.login" />
</template>

<style lang="sass" scoped>
$headerImg: 200px
$avaSize: 160px
$cropper: 95dvh
.popup-cropper
  &__img
    width: $cropper
    object-fit: cover
.cropper-wrap-box
  display: flex
  flex-direction: column
  &__margin
    height: calc( (100dvh - $cropper) / 2 + 1px )
    background: $cropperBG
.cropper-wrapper
  height: 100dvh
  width: 100%
  counter-reset: none
.cropper-container
  display: flex
  align-items: center
  justify-content: center
  position: static
  height: $cropper

.preview
  overflow: hidden
  position: absolute
  border-radius: 200px
  z-index: 1
  &_1
    width: 160px
    height: 160px
    top: 20px
    right: 40px
  &_2
    width: 100px
    height: 100px
    top: 190px
    right: 40px
  &_3
    width: 40px
    height: 40px
    top: 300px
    right: 40px

.popup-cropper
  position: fixed
  top: 0
  left: 0
  height: 100dvh
  width: 100%
  display: flex
  justify-content: center
  align-content: center
  &__button:hover
    scale: 1.1
  &__button
    transition: .1s
    position: absolute
    z-index: 1
    background-color: $buttonBlue
    color: $textColor
    font-size: 1.4em
    font-weight: 700
    padding: .3em .8em
    &_upload
      top: 20px
      left: 40px
    &_close
      top: 20px
      left: 190px
    &_new-image
      width: 170px
      top: 80px
      left: 40px
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

.popup
  &__close
    display: none
</style>
