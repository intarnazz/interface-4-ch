<script setup>
import { ref } from "vue";
const descriptionOpen = ref(false);

function descriptionOpenEvent(e) {
  e ? (descriptionOpen.value = true) : (descriptionOpen.value = false);
}
</script>

<template>
  <div class="description">
    <div
      @click="descriptionOpenEvent(true)"
      class="description__content"
      :class="{ descriptionClose: !descriptionOpen }"
    >
      <p
        class="description__content_p"
        :class="{ descriptionOpen: descriptionOpen }"
      >
        ✅Lorem ipsum, dolor sit amet consectetur,<br />
        ✅adipisicing elit. Aliquid,<br />
        ✅voluptate sequi, magni quis dicta veritatis voluptatum.<br />
        reprehenderit deleniti, id optio praesentium. Aut ut consectetur
        necessitatibus nulla porro asperiores eos laboriosam? Lorem ipsum dolor
        sit amet consectetur adipisicing elit. Atque asperiores accusamus a
        minima, nemo eligendi. Atque, dolore iure. Suscipit, asperiores?
        Sapiente nihil voluptatum labore, veniam ullam facere consectetur ut
        doloremque?
      </p>
      <div>
        <span v-if="!descriptionOpen" style="font-weight: 700">...more</span>
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
</template>

<style lang="sass" scoped>
.description
  line-height: 1.4em
  &__content
    transition: .1s
    padding: 1em
    background-color: $subBgColor
    border-radius: 10px
    cursor: default
    &_p
      height: 90px
      overflow: hidden
      text-overflow: ellipsis


.descriptionOpen
  height: auto

.descriptionClose:hover
  transition: .1s
  background-color: rgba(255, 255, 255, 0.2)
</style>
