<template>
  <div v-if="viduStore.publisher">
    <video ref="videoElement" autoplay class="rounded-lg"></video>
  </div>
  <br />

  <br />
</template>

<script setup>
import { computed, watch, ref, onMounted } from 'vue';
import { useViduStore } from '@/stores/vidu.js';

const viduStore = useViduStore();
const videoElement = ref(null);
// const canvas = ref(null);
// const isDrawing = ref(false);
// const selectedColor = ref('#000000'); // 초기 색상은 검은색
onMounted(() => {
  if (viduStore.publisherTest) {
    viduStore.publisher.addVideoElement(videoElement.value);
  }
});
watch(
  () => viduStore.publisherTest,
  (newValue, oldValue) => {
    if (viduStore.publisherTest) {
      viduStore.publisher.addVideoElement(videoElement.value);
    }
  },
);

const enterPiPMode = async () => {
  try {
    if (document.pictureInPictureEnabled) {
      await videoElement.value.requestPictureInPicture();
    } else {
      console.error('PiP 모드를 지원하지 않는 브라우저입니다.');
    }
  } catch (error) {
    console.error('PiP 모드 진입 중 오류가 발생했습니다:', error);
  }
};
// const startDrawing = () => {
//   isDrawing.value = true;
// };

// const stopDrawing = () => {
//   isDrawing.value = false;
//   const ctx = canvas.value.getContext('2d');
//   ctx.beginPath(); // 새로운 경로 시작
// };

// const draw = event => {
//   if (!isDrawing.value) return;

//   const canvasElement = canvas.value;
//   const ctx = canvasElement.getContext('2d');

//   // 마우스 위치에서 선 그리기
//   ctx.strokeStyle = 'black';
//   ctx.lineWidth = 5;
//   ctx.lineCap = 'round';
//   ctx.strokeStyle = selectedColor.value;

//   // 정확한 위치로 그리기
//   ctx.lineTo(
//     event.clientX - canvasElement.getBoundingClientRect().left,
//     event.clientY - canvasElement.getBoundingClientRect().top,
//   );
//   ctx.stroke();
//   ctx.beginPath(); // 새로운 경로 시작
//   ctx.moveTo(
//     event.clientX - canvasElement.getBoundingClientRect().left,
//     event.clientY - canvasElement.getBoundingClientRect().top,
//   );
// };
</script>

<style scoped>
.video {
  border: 1px solid black;
}
.canvas {
  position: absolute;
  top: 0;
  left: 0;
  cursor: crosshair;
}
</style>
