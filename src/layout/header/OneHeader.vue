<script setup>
import { onMounted, ref } from "vue";
import ComponentsFormAutorisation from "@/components/ComponentsFormAutorisation.vue";

const emit = defineEmits();

const API_URL = import.meta.env.VITE_API_URL;
const authorizedLogin = ref(null);
const loginFormOpen = ref(false);
const userInfoOpen = ref(false);
const popup = ref(null);

function getUser() {
  if (localStorage.getItem("user")) {
    authorizedLogin.value = localStorage.getItem("user");
    emit("userEvent", false);
  } else {
    emit("userEvent", true);
  }
  userInfoOpen.value = false;
}

onMounted(() => {
  getUser();
});

function ComponentsFormAutorisationEventColse(colse) {
  loginFormOpen.value = false;
  document.removeEventListener("click", userInfoCloseEvent);
  getUser();
}

function popupOpenEvent() {
  loginFormOpen.value = true;
}
function userInfoOpenEvent() {
  if (userInfoOpen.value === false) {
    userInfoOpen.value = true;
    event.stopPropagation();
    document.addEventListener("click", userInfoCloseEvent);
  }
}
function userInfoCloseEvent(event) {
  if (popup.value && !popup.value.contains(event.target)) {
    userInfoOpen.value = false;
    document.removeEventListener("click", userInfoCloseEvent);
  }
}
function logout() {
  authorizedLogin.value = null;
  userInfoOpen.value = false;
  localStorage.removeItem("user");
  localStorage.removeItem("pasword");
  emit("userEvent", true);
}
</script>

<template>
  <header class="header">
    <RouterLink :to="{ name: 'Home' }">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </RouterLink>
    <button
      v-if="!authorizedLogin"
      @click="popupOpenEvent()"
      class="header__button-loggin button_loggin button"
    >
      <span class="material-symbols-outlined"> person </span> Войти
    </button>
    <div v-else @click="userInfoOpenEvent()" class="header__user user">
      {{ authorizedLogin }}
      <div class="user__ava-wrapper">
        <img
          :src="`${API_URL}profileImage/${authorizedLogin}`"
          alt=""
          class="user__ava"
        />
      </div>
      <div
        ref="popup"
        class="popup popup-user-info"
        :class="{ popup__close: !userInfoOpen }"
      >
        <div class="popup-user-info__header">
          <img
            :src="`${API_URL}profileImage/${authorizedLogin}`"
            alt=""
            class="popup-user-info__ava"
          />
          {{ authorizedLogin }}
        </div>
        <hr />
        <ul class="popup-user-info__list">
          <li @click="logout()" class="popup-user-info__item">
            <span class="material-symbols-outlined"> logout </span> Sing out
          </li>
        </ul>
      </div>
    </div>
  </header>
  <ComponentsFormAutorisation
    @colse="ComponentsFormAutorisationEventColse"
    :popupOpen="loginFormOpen"
  />
</template>

<style lang="sass" scoped>
.popup-user-info
  position: absolute
  top: 0
  width: 300px
  background-color: #282828
  left: -240px
  border-radius: 20px
  cursor: default
  padding-bottom: 1em
  &__header
    padding: 1em
    display: flex
    align-items: center
    gap: 1em
  &__ava
    width: 40px
    height: 40px
    border-radius: 40px
    object-fit: cover
  &__item
    padding: .5em 1em
    display: flex
    align-items: center
    gap: .5em
    cursor: pointer
  &__item:hover
    background-color: $subBgColor
  &__bg
    z-index: 1
    position: fixed
    height: 100dvh
    width: 100vw
    top: 0
    left: 0

.header
  display: flex
  justify-content: space-between
  align-items: center
  &__button-loggin
    padding-left: 6px
    color: #64b4ff
    display: flex
    align-items: center
    border-radius: 20px
    cursor: pointer
    height: 34px
    width: 94px
    background: none
    border: 2px $subBgColor solid
  &__button-loggin:hover
    border: 2px rgba(100, 180, 255, 0) solid
    background-color: rgba(100, 180, 255, 0.1)

.user
  display: flex
  align-items: center
  gap: 1em
  position: relative
  cursor: pointer
  &__ava
    width: 32px
    height: 32px
    border-radius: 32px
    object-fit: cover

.logo
  height: 6em
  padding: 1.5em
  will-change: filter
  transition: filter 300ms

.logo:hover
  filter: drop-shadow(0 0 2em #646cffaa)

.logo.vue:hover
  filter: drop-shadow(0 0 2em #42b883aa)

.popup
  &__close
    display: none
</style>
