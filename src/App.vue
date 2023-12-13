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
const popupButton = ref(null);

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
  <RouterView :logOutEvent="logOutEvent" />
</template>

<style lang="sass">
@import "@/assets/css/style.sass"
</style>
