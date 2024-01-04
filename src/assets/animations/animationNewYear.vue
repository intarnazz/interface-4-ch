<script setup>
import { random } from "lodash";
import { ref } from "vue";

const snowflakeArr = ref([]);

let loop = -2000;
setInterval(() => {
  for (let i = 0; i < snowflakeArr.value.length; i++) {
    snowflakeArr.value[i].pos_y += snowflakeArr.value[i].size / 20;
    if (snowflakeArr.value[i].pos_delta >= snowflakeArr.value[i].size) {
      snowflakeArr.value[i].pos_way = snowflakeArr.value[i].pos_way * -1;
    } else if (snowflakeArr.value[i].pos_delta <= -5) {
      snowflakeArr.value[i].pos_way = snowflakeArr.value[i].pos_way * -1;
    }
    snowflakeArr.value[i].pos_delta =
      snowflakeArr.value[i].pos_delta +
      (snowflakeArr.value[i].size / 1000) * snowflakeArr.value[i].pos_way;
  }
  if (loop >= 200) {
    const snowflakeSize = random(2, 5);
    const snowflakePos = random(1, 100);
    const snowflakeNew = {
      size: snowflakeSize,
      pos_delta: 0,
      pos_way: 1,
      pos_x: snowflakePos,
      pos_y: -10,
    };
    snowflakeArr.value = [...snowflakeArr.value, snowflakeNew];
    loop = 0;
  }
  for (let i = 0; i < snowflakeArr.value.length; i++) {
    if (snowflakeArr.value[i].pos_y >= window.innerHeight + 10) {
      snowflakeArr.value.splice(i, 1);
      i--;
    }
  }
  loop++;
}, 1);
</script>
<template>
  <section class="animation">
    <div
      v-for="(item, id) in snowflakeArr"
      :key="id"
      class="snowflake"
      :style="`left: ${item.pos_x + item.pos_delta}%; 
      top: ${item.pos_y}px; 
      width: ${item.size}px; 
      height: ${item.size}px`"
    ></div>
  </section>
</template>
<style lang="sass" scoped>
.animation
  width: 95vw
  position: fixed
  top: 0px
  left: 15px
.snowflake
  position: absolute
  background-color: #4694ad
  border-radius: 10px
  margin: -10px
  pointer-events: none
</style>
