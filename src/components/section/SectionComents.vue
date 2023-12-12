<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { CommentGET, CommentPOST } from "@/api/api.js";

const API_URL = import.meta.env.VITE_API_URL;
const $route = useRoute();
const loding = ref(true);
const authorizedLogin = ref(null);
const InputFocus = ref(false);
const InputFocusFirst = ref(false);
const InputValue = ref("");
const ButtonDisabled = ref(true);
const comments = ref({});
const errorServerNotFound = ref(false);

async function fetchData() {
  loding.value = true;
  try {
    if (localStorage.getItem("user")) {
      authorizedLogin.value = localStorage.getItem("user");
    }
    comments.value = await CommentGET($route.params.id);
    loding.value = false;
  } catch (e) {
    errorServerNotFound.value = true;
    loding.value = false;
  }
}

onMounted(async () => {
  await fetchData();
});
async function commentPost() {
  const msg = InputValue.value;
  InputValue.value = "";
  const user = localStorage.getItem("user");
  const psw = localStorage.getItem("pasword");

  const code = await CommentPOST(user, psw, $route.params.id, msg);
  if (code === 200) {
    comments.value.unshift({
      text: msg,
      user: user,
    });
  }
}
function InputFocusEvent(e) {
  if (e) {
    InputFocusFirst.value = true;
    InputFocus.value = true;
  } else {
    InputFocus.value = false;
  }
}
function InputValueChange() {
  if (InputValue.value) {
    ButtonDisabled.value = false;
  } else {
    ButtonDisabled.value = true;
  }
}
function commentSectionClear() {
  InputFocusFirst.value = false;
  InputValue.value = "";
}
watch(() => InputValue.value, InputValueChange);
</script>

<template>
  <section class="comment-section">
    <h2 class="comment-section__title">
      {{ Object.keys(comments).length }} Comments
    </h2>
    <template v-if="!loding">
      <div v-if="!errorServerNotFound" class="comment-section__form-posting">
        <img
          :src="`${API_URL}profileImage/${authorizedLogin}`"
          alt=""
          class="popup-user-info__ava comment-section__ava"
        />
        <form @submit.prevent="commentPost" class="comment-section__form">
          <input
            @focusin="InputFocusEvent(true)"
            @focusout="InputFocusEvent(false)"
            v-model="InputValue"
            placeholder="Add a comment..."
            class="comment-section__input"
            type="text"
          />
          <div class="comment-section__input-sub-line">
            <div
              class="comment-section__input-sub-line_aside"
              :class="{
                'comment-section__input-sub-line_aside-activ': InputFocus,
              }"
            ></div>
            <div
              class="comment-section__input-sub-line_center"
              :class="{
                'comment-section__input-sub-line_center-activ': InputFocus,
              }"
            ></div>
            <div
              class="comment-section__input-sub-line_aside"
              :class="{
                'comment-section__input-sub-line_aside-activ': InputFocus,
              }"
            ></div>
          </div>
          <div v-if="InputFocusFirst" class="comment-section__button-wrapper">
            <input
              :disabled="ButtonDisabled"
              value="Comment"
              class="comment-section__form-button"
              :class="{ ButtonDisabled: ButtonDisabled }"
              type="submit"
            />
            <button
              @click="commentSectionClear()"
              class="comment-section__button-clear"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      <ul class="comment-section__users-comments users-comments">
        <li
          v-for="(comment, key) in comments"
          :key="key"
          class="users-comments__item"
        >
          <img
            :src="`${API_URL}profileImage/${comment.user}`"
            alt=""
            class="users-comments__ava"
          />
          <div class="users-comments__coment-wrapper">
            <div class="users-comments__user-name">@{{ comment.user }}</div>
            <div class="users-comments__coment">
              {{ comment.text }}
            </div>
          </div>
        </li>
      </ul>
    </template>
  </section>
</template>

<style lang="sass" scoped>
.users-comments
  margin-top: 2em
  display: flex
  flex-direction: column
  gap: 1em
  &__coment-wrapper
    display: flex
    flex-direction: column
    gap: 6px
  &__user-name
    font-weight: 500
    font-size: 13px
  &__item
    display: flex
    gap: 1em
  &__ava
    width: 40px
    height: 40px
    border-radius: 40px
    object-fit: cover

.comment-section
  &__title
    margin: 1em 0
  &__form-posting
    display: flex
    gap: 1em
  &__input
    margin-bottom: 5px
    width: 100%
    background: none
  &__form
    width: 100%
  &__form-button
    cursor: pointer
    font-weight: 500
    color: #000
    background-color: #3ea6ff
    border-radius: 20px
    padding: 0 14px
    height: 36px
  &__button-clear
    font-weight: 500
    color: $textColor
    background: none
    border-radius: 20px
    padding: 0 14px
    height: 36px
  &__button-clear:hover
    background-color: $subBgColor
  &__button-wrapper
    margin-top: 1em
    display: flex
    flex-direction: row-reverse
    justify-content: end
    gap: 1em
  &__input-sub-line
    display: flex
    justify-content: center
    &_center
      flex: 0
      border-top: 1px $textColor solid
      transition: .5s
    &_center-activ
      flex: 1
    &_aside
      flex: 1
      border-top: 1px $subBgColor solid
      transition: .5s
    &_aside-activ
      flex: 0
      border-top: 1px $subBgColor solid
      transition: .5s
.ButtonDisabled
  background-color: $subBgColor
  color: rgba(255, 255, 255, 0.5)
  cursor: default
</style>
