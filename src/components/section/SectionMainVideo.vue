<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { videoGET, CommentGET, likeGET, CommentPOST } from "@/api/api.js";

const API_URL = import.meta.env.VITE_API_URL;
const arr = ref(null);
const arrAside = ref(null);
const $route = useRoute();
const loding = ref(true);
const like = ref(0);
const dislike = ref(0);
const likeClickActiv = ref(false);
const dislikeClickActiv = ref(false);
const authorizedLogin = ref(null);
const commentSectionInputFocus = ref(false);
const commentSectionInputFocusFirst = ref(false);
const commentSectionInputValue = ref("");
const ButtonDisabled = ref(true);
const comments = ref({});
const descriptionOpen = ref(false);

async function fetchData() {
  if (localStorage.getItem("user")) {
    authorizedLogin.value = localStorage.getItem("user");
  }
  loding.value = true;
  likeClickActiv.value = false;
  dislikeClickActiv.value = false;

  arr.value = await videoGET($route.params.id);

  like.value = arr.value[$route.params.id].like ?? 0;
  dislike.value = arr.value[$route.params.id].dislike ?? 0;

  arrAside.value = await videoGET();

  loding.value = false;
  comments.value = await CommentGET($route.params.id);
}

onMounted(async () => {
  await fetchData();
});

const likeFix = computed(() => {
  return like.value >= 1000 ? (like.value / 1000).toFixed(1) + "K" : like.value;
});

const dislikeFix = computed(() => {
  return dislike.value >= 1000
    ? (dislike.value / 1000).toFixed(1) + "K"
    : dislike.value;
});

async function likeClick() {
  if (dislikeClickActiv.value) {
    --dislike.value;
    ++like.value;
    dislikeClickActiv.value = false;
    likeClickActiv.value = true;

    await likeGET($route.params.id, -1, "dislike");
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
    await likeGET($route.params.id, 1, "dislike");
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

    await likeGET($route.params.id, delta, "dislike");
  }
}
async function commentPost() {
  const msg = commentSectionInputValue.value;
  commentSectionInputValue.value = "";
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
function commentSectionInputFocusEvent(e) {
  if (e) {
    commentSectionInputFocusFirst.value = true;
    commentSectionInputFocus.value = true;
  } else {
    commentSectionInputFocus.value = false;
  }
}
function commentSectionInputValueChange() {
  if (commentSectionInputValue.value) {
    ButtonDisabled.value = false;
  } else {
    ButtonDisabled.value = true;
  }
}
function commentSectionClear() {
  commentSectionInputFocusFirst.value = false;
  commentSectionInputValue.value = "";
}
function descriptionOpenEvent(e) {
  e ? (descriptionOpen.value = true) : (descriptionOpen.value = false);
}
watch(() => $route.params.id, fetchData);
watch(() => commentSectionInputValue.value, commentSectionInputValueChange);
</script>

<template>
  <template v-if="!loding">
    <section class="main-video-section">
      <div class="video-wrapper">
        <video
          :src="`${API_URL}image/${$route.params.id}?tred=video_api`"
          class="video"
          controls
          autoplay
          loop="-1"
        ></video>
        <div class="video-wrapper__sup-text">
          <h2 class="video__name">
            {{ arr[$route.params.id].name }}
          </h2>
          <div class="video__reaction reaction">
            <div @click="likeClick()" class="reaction__like">
              <span
                class="material-symbols-outlined"
                :class="{ reaction__like_activ: likeClickActiv }"
              >
                thumb_up </span
              >{{ likeFix }}
            </div>
            <div
              style="
                border-left: 1px rgba(255, 255, 255, 0.4) solid;
                height: 1.5em;
              "
              class="line"
            ></div>
            <div @click="dislikeClick()" class="reaction__dislike">
              <span
                class="material-symbols-outlined"
                :class="{ reaction__dislike_activ: dislikeClickActiv }"
              >
                thumb_down </span
              >{{ dislikeFix }}
            </div>
            <div class="reaction__delta">
              <div :style="`flex: ${like};`" class="reaction__delta_like"></div>
              <div
                :style="`flex: ${dislike};`"
                class="reaction__delta_dislike"
              ></div>
            </div>
          </div>
        </div>
        <hr />
        <div class="video-wrapper__sub-text">
          <div
            @click="descriptionOpenEvent(true)"
            class="video-wrapper__description"
            :class="{ descriptionClose: !descriptionOpen }"
          >
            <p
              class="video-wrapper__description_p"
              :class="{ descriptionOpen: descriptionOpen }"
            >
              ✅Lorem ipsum, dolor sit amet consectetur,<br />
              ✅adipisicing elit. Aliquid,<br />
              ✅voluptate sequi, magni quis dicta veritatis voluptatum.<br />
              reprehenderit deleniti, id optio praesentium. Aut ut consectetur
              necessitatibus nulla porro asperiores eos laboriosam? Lorem ipsum
              dolor sit amet consectetur adipisicing elit. Atque asperiores
              accusamus a minima, nemo eligendi. Atque, dolore iure. Suscipit,
              asperiores? Sapiente nihil voluptatum labore, veniam ullam facere
              consectetur ut doloremque?
            </p>
            <div>
              <span v-if="!descriptionOpen" style="font-weight: 700"
                >...more</span
              >
              <div
                v-else
                @click.stop="descriptionOpenEvent(false)"
                style="font-weight: 700; cursor: pointer"
              >
                Show less
              </div>
            </div>
          </div>
        </div>
        <section class="comment-section">
          <h2 class="comment-section__title">
            {{ Object.keys(comments).length }} Comments
          </h2>
          <div class="comment-section__form-posting">
            <img
              :src="`${API_URL}profileImage/${authorizedLogin}`"
              :alt="`${authorizedLogin}`"
              class="popup-user-info__ava comment-section__ava"
            />
            <form @submit.prevent="commentPost" class="comment-section__form">
              <input
                @focusin="commentSectionInputFocusEvent(true)"
                @focusout="commentSectionInputFocusEvent(false)"
                v-model="commentSectionInputValue"
                placeholder="Add a comment..."
                class="comment-section__input"
                type="text"
              />
              <div class="comment-section__input-sub-line">
                <div
                  class="comment-section__input-sub-line_aside"
                  :class="{
                    'comment-section__input-sub-line_aside-activ':
                      commentSectionInputFocus,
                  }"
                ></div>
                <div
                  class="comment-section__input-sub-line_center"
                  :class="{
                    'comment-section__input-sub-line_center-activ':
                      commentSectionInputFocus,
                  }"
                ></div>
                <div
                  class="comment-section__input-sub-line_aside"
                  :class="{
                    'comment-section__input-sub-line_aside-activ':
                      commentSectionInputFocus,
                  }"
                ></div>
              </div>
              <div
                v-if="commentSectionInputFocusFirst"
                class="comment-section__button-wrapper"
              >
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
                :alt="`${comment.user}`"
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
        </section>
      </div>
      <section class="video-section">
        <template v-for="(item, id) in arrAside" :key="id">
          <RouterLink
            v-if="id !== $route.params.id"
            :to="{ name: 'Video', params: { id: id } }"
            class="video-section__item-wrapper"
          >
            <video
              :src="`${API_URL}image/${id}?tred=video_api`"
              class="video-section__item"
              preload="metadata"
            ></video>
            <p class="video-section__item-name">
              {{ item.name }}
            </p>
          </RouterLink>
        </template>
      </section>
    </section>
  </template>
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
.video-wrapper
  flex: 2.3
  &__sup-text
    padding-left: .2em
    display: flex
    justify-content: space-between
    align-items: flex-start
    margin: .5em 2em 0 0
  &__sub-text
    line-height: 1.4em
  &__description
    transition: .1s
    padding: 1em
    background-color: $subBgColor
    border-radius: 10px
    cursor: default
    &_p
      height: 90px
      overflow: hidden
      text-overflow: ellipsis
.video
  width: 100%
  max-height: 70vh
  border-radius: 20px
  &__name
    line-height: normal
    font-size: 1.4em
    font-weight: 500

.video-section
  flex: 1
  flex-direction: column
  &__item-wrapper
    display: flex
    gap: 1em
    border-radius: 10px
  &__item-name
    height: 94px
    width: auto
    font-size: 14px
    font-weight: 400
    line-height: 1.4em
    flex: 1
    white-space: normal
  &__item
    width: 168px
    height: 94px

.main-video-section
  display: flex
  gap: 1em

.ButtonDisabled
  background-color: $subBgColor
  color: rgba(255, 255, 255, 0.5)
  cursor: default

.descriptionOpen
  height: auto

.descriptionClose:hover
  transition: .1s
  background-color: rgba(255, 255, 255, 0.2)
</style>
