<script setup>
import { onMounted, ref } from "vue";

const API_URL = "http://127.0.0.1:5000/";
const arr = ref(null);
const login = ref("");
const pasword = ref("");
const authorizedLogin = ref(null);
const loginFormOpen = ref(false);
const userInfoOpen = ref(false);

onMounted(async () => {
  if (localStorage.getItem("user")) {
    authorizedLogin.value = localStorage.getItem("user");
    console.log(authorizedLogin.value);
  }
  await fetch(`${API_URL}api`)
    .then((response) => response.json())
    .then((json) => {
      arr.value = json.data;
    });
});

async function submitForm() {
  await fetch(`${API_URL}login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      login: login.value,
      password: pasword.value,
    }),
  })
    .then((response) => response.json())
    .then((json) => {
      if (json.code === 200) {
        authorizedLogin.value = login.value;
        localStorage.setItem("user", login.value);
        localStorage.setItem("pasword", pasword.value);
        loginFormOpen.value = false;
      }
    });
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
function userInfoColseEvent() {
  userInfoOpen.value = false;
}
function logout() {
  authorizedLogin.value = null;
  userInfoOpen.value = false;
  localStorage.removeItem("user");
  localStorage.removeItem("pasword");
}
</script>

<template>
  <div
    v-if="userInfoOpen"
    @click.stop="userInfoColseEvent()"
    class="popup-user-info__bg"
  ></div>
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
          :alt="`${authorizedLogin}`"
          class="user__ava"
        />
      </div>
      <div
        @click.stop=""
        class="popup popup-user-info"
        :class="{ popup__close: !userInfoOpen }"
      >
        <div class="popup-user-info__header">
          <img
            :src="`${API_URL}profileImage/${authorizedLogin}`"
            :alt="`${authorizedLogin}`"
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
        <label for="">Login</label><input v-model="login" type="text" />
      </p>
      <p class="popup-login__row">
        <label for="">password</label
        ><input v-model="pasword" type="password" />
      </p>
      <p class="popup-login__row"><input type="submit" /></p>
    </form>
  </div>
  <RouterView />
</template>

<style lang="sass">
@import "@/assets/css/style.sass"
</style>
