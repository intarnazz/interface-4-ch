<script setup>
import { nextTick, ref, watch } from "vue";
import { loginPOST, UserRegistarationPOST } from "@/api/api.js";

const props = defineProps(["popupOpen"]);
const emit = defineEmits(["colse"]);

const login = ref("");
const pasword = ref("");
const authorizedLogin = ref(null);
const logOutEvent = ref(true);
const input = ref(null);

function localStorageUpdata() {
  authorizedLogin.value = login.value;
  localStorage.setItem("user", login.value);
  localStorage.setItem("pasword", pasword.value);
  emit("colse", true);
  logOutEvent.value = false;
}

async function submitForm() {
  const code = await loginPOST(login.value, pasword.value);
  if (code === 200) {
    localStorageUpdata();
  }
}
function popupColseEvent() {
  emit("colse", true);
}
function inputFocus(newValue) {
  console.log(newValue);
  if (newValue) {
    nextTick(() => {
      input.value.focus();
    });
  }
}
async function UserRegistation() {
  const code = await UserRegistarationPOST(login.value, pasword.value);
  if (code === 200) {
    localStorageUpdata();
  }
}

watch(() => props.popupOpen, inputFocus);
</script>

<template>
  <div
    @click="popupColseEvent"
    class="popup popup-login"
    :class="{ popup__close: !props.popupOpen }"
  >
    <form @submit.prevent="" @click.stop class="popup-login__form" action="">
      <div class="popup-login__form-wrapper">
        <div class="popup-login__row">
          <input
            ref="input"
            placeholder="Login..."
            v-model="login"
            type="text"
            class="popup-login__input"
            autofocus
          />
        </div>
        <div class="popup-login__row">
          <input
            placeholder="password..."
            v-model="pasword"
            type="password"
            class="popup-login__input"
          />
        </div>
        <div class="popup-login__row">
          <button @click="submitForm" class="popup-login__button">Войти</button>
          <button
            @click="UserRegistation"
            class="popup-login__button"
            style="flex: 1"
          >
            Зарегистрироваться
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<style lang="sass" scoped>
.popup-login
  width: 100vw
  height: 100dvh
  position: fixed
  top: 0
  left: 0
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
  &__form-wrapper
    display: flex
    flex-direction: column
    gap: 1em
  &__row
    position: relative
    display: flex
    gap: 1em
  &__input
    color: #fff
    background-color: $formPost
    border: 1px solid $aColorHover
    border-radius: .5em
    padding: .5em
    width: 300px
  &__button
    color: #fff
    cursor: pointer
    background-color: $formPost
    border: 1px solid $aColorHover
    border-radius: .5em
    padding: .2em 1em
    transition: 1s
  &__button:hover
    background-color: $aColorHover

  &__placeholder
    transition: 1s
    position: absolute
    pointer-events: none
    left: 10px
    top: 10px
    background-color: $formPost
.popup
  &__close
    display: none
</style>
