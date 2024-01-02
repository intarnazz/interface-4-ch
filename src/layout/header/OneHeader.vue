<script setup>
import { onMounted, ref } from "vue";
import { loginPOST } from "@/api/api.js";

const API_URL = import.meta.env.VITE_API_URL;
const login = ref("");
const pasword = ref("");
const authorizedLogin = ref(null);
const loginFormOpen = ref(false);
const userInfoOpen = ref(false);
const logOutEvent = ref(true);
const popup = ref(null);

onMounted(async () => {
  document.addEventListener("click", userInfoColseEvent);
  if (localStorage.getItem("user")) {
    authorizedLogin.value = localStorage.getItem("user");
    logOutEvent.value = false;
    console.log(authorizedLogin.value);
  }
});

async function submitForm() {
  const code = await loginPOST(login.value, pasword.value);
  if (code === 200) {
    authorizedLogin.value = login.value;
    localStorage.setItem("user", login.value);
    localStorage.setItem("pasword", pasword.value);
    loginFormOpen.value = false;
    logOutEvent.value = false;
  }
}

function popupOpenEvent() {
  loginFormOpen.value = true;
}
function popupColseEvent() {
  loginFormOpen.value = false;
}
function userInfoOpenEvent() {
  userInfoOpen.value = true;
}
function userInfoColseEvent(event) {
  if (popup.value && !popup.value.contains(event.target)) {
    userInfoOpen.value = false;
  }
}
function logout() {
  authorizedLogin.value = null;
  userInfoOpen.value = false;
  logOutEvent.value = true;
  localStorage.removeItem("user");
  localStorage.removeItem("pasword");
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
    <div
      v-else
      ref="popup"
      @click="userInfoOpenEvent()"
      class="header__user user"
    >
      {{ authorizedLogin }}
      <div class="user__ava-wrapper">
        <img
          :src="`${API_URL}profileImage/${authorizedLogin}`"
          alt=""
          class="user__ava"
        />
      </div>
      <div
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
  <div
    @click="popupColseEvent"
    class="popup popup-login"
    :class="{ popup__close: !loginFormOpen }"
  >
    <form
      @click.stop
      @submit.prevent="submitForm"
      class="popup-login__form"
      action=""
    >
      <p class="popup-login__row">
        <label for="">Login</label
        ><input v-model="login" type="text" class="popup-login__input" />
      </p>
      <p class="popup-login__row">
        <label for="">password</label
        ><input v-model="pasword" type="password" class="popup-login__input" />
      </p>
      <p class="popup-login__row">
        <input type="submit" class="popup-login__input" />
      </p>
    </form>
  </div>
</template>

<style lang="sass">
.popup-login
  width: 100vw
  height: 100dvh
  position: fixed
  background-color: rgba(0, 0, 0, 0.9)
  display: flex
  align-items: center
  justify-content: center
  &__form
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    width: 500px
    height: 500px
    background-color: $formPost
    border-radius: 20px
    gap: 20px
  &__row
    display: flex
    justify-content: space-between
    width: 300px
  &__input
    color: #000

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
