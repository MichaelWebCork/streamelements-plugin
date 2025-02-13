<script setup>
import confetti from "../Confetti.vue";
import { Icon } from "@iconify/vue";
import { ref, reactive, onMounted, computed, watch } from "vue";
import { animate } from "motion";

const money = ref(100);
const icon = ref(null);
const moneyContainer = ref(null);
const progress = ref(null);
const showConfetti = ref(false);

const animations = reactive([]);

const fieldData = ref({});

onMounted(async () => {
  if (import.meta.env.DEV) {
    function transformObject(inputObj) {
      const result = {};

      for (const key in inputObj) {
        if (
          inputObj[key] &&
          typeof inputObj[key] === "object" &&
          "value" in inputObj[key]
        ) {
          result[key] = inputObj[key].value;
        }
      }

      return result;
    }
    const data = await import("./fields.json");
    fieldData.value = transformObject(data.default);
  } else {
    window.addEventListener("onWidgetLoad", function (obj) {
      fieldData.value = obj.detail.fieldData;
    });
  }
});

function playAllAnimations() {
  if (!animations.length) {
    animations.push(
      animate(
        icon.value,
        { rotate: 360 },
        { duration: 0.6, type: "spring", bounce: 0.5 }
      )
    );
    animations.push(
      animate(
        moneyContainer.value,
        { y: [20, 0], opacity: [0, 1] },
        { duration: 0.6, type: "spring", bounce: 0.5 }
      )
    );
  } else {
    animate(
      progress.value,
      { width: `${(money.value / fieldData.value.goalAmount) * 100}%` },
      { duration: 0.6, type: "spring", bounce: 0.5 }
    );
    animations.forEach((animation) => {
      animation.pause();
      animation.time = 0;
      animation.play();
    });
  }
  showConfetti.value = false;
  if (money.value >= fieldData.value.goalAmount) {
    showConfetti.value = true;
  }
}

function increment() {
  if (money.value < fieldData.value.goalAmount) {
    money.value += 50;
    playAllAnimations();
  }
}

function decrement() {
  if (money.value > 0) {
    money.value -= 50;
    playAllAnimations();
  }
}
</script>

<template>
  <div class="flex h-svh w-svw items-center justify-center p-5">
    <div class="relative">
      <div
        class="absolute -top-4 left-32 z-10 -translate-x-1/2 rounded-full bg-yellow-300 px-3 py-1 text-sm font-bold text-blue-950 shadow-md"
      >
        {{ fieldData.goalTitle }}
      </div>

      <div
        class="relative flex w-fit items-center gap-4 rounded-full bg-blue-950 px-6 py-4 text-white"
      >
        <div
          ref="icon"
          class="shrink rounded-full p-2 outline-2 outline-yellow-300"
        >
          <Icon
            icon="fluent-emoji-high-contrast:money-bag"
            class="money-icon text-4xl text-yellow-300"
          />
        </div>
        <div>
          <div class="mb-2 text-xl font-bold">
            <span ref="moneyContainer" class="money-amount inline-block">
              €{{ money }}
            </span>
            / €{{ fieldData.goalAmount }}
          </div>
          <div class="relative h-4 w-60 overflow-hidden rounded-full">
            <div class="absolute h-full w-full bg-blue-600/20"></div>
            <div
              ref="progress"
              class="progress-bar absolute h-full rounded-full bg-yellow-300"
              :style="{ width: `${(money / fieldData.goalAmount) * 100}%` }"
            ></div>
          </div>
        </div>
      </div>

      <div class="mt-4 flex justify-center gap-2">
        <confetti v-if="showConfetti" />
        <button
          @click="increment"
          class="rounded bg-amber-500 px-4 py-2 text-white"
        >
          Increment
        </button>
        <button
          @click="decrement"
          class="rounded bg-red-500 px-4 py-2 text-white"
        >
          Decrement
        </button>
      </div>
    </div>
  </div>
</template>
