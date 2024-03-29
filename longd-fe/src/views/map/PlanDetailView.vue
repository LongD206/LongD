<template>
  <div class="flex justify-end gap-1 mb-7">
    <button
      class="btn btn-sm"
      style="background-color: #ffeded"
      @click="deletePlan()"
    >
      삭제
    </button>
    <button
      class="btn btn-sm"
      style="background-color: #ffeded"
      @click="goList"
    >
      목록
    </button>
  </div>

  <div class="flex gap-4">
    <div class="flex flex-col w-1/2">
      <div class="flex h-8 rounded-full shadow-xl">
        <div
          class="w-1/4 bg-red-200 text-center rounded-tl-full rounded-bl-full"
        >
          <p>제목</p>
        </div>
        <div class="w-3/4 text-center">
          <p>{{ planDetail.title }}</p>
        </div>
      </div>

      <!-- 마커를 표시할 지도 -->
      <div class="googleMap rounded-xl mt-4 shadow-xl" id="googleMap"></div>
      <div class="carousel w-full mt-4 rounded-xl">
        <div
          v-for="(slide, index) in planGalleryList"
          :key="index"
          :id="`slide${index + 1}`"
          class="carousel-item relative w-full"
        >
          <img :src="slide.pathUrl" class="w-full" />
          <div
            class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2"
          >
            <a
              :href="`#slide${index === 0 ? planGalleryList.length : index}`"
              class="btn btn-circle"
              style="
                background-color: transparent;
                border-color: transparent;
                color: white;
              "
              >❮</a
            >
            <a
              :href="`#slide${index === planGalleryList.length - 1 ? 1 : index + 2}`"
              class="btn btn-circle"
              style="
                background-color: transparent;
                border-color: transparent;
                color: white;
              "
              >❯</a
            >
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col w-1/2">
      <div class="flex h-8 rounded-full shadow-xl">
        <div
          class="w-1/4 bg-red-200 text-center rounded-tl-full rounded-bl-full"
        >
          <p>일정</p>
        </div>
        <div class="w-3/4 text-center">
          <p>{{ planDetail.dateStart }} ~ {{ planDetail.dateEnd }}</p>
        </div>
      </div>
      <div class="my-4" v-for="date in dateList" :key="date.id">
        <div>
          <div class="bg-red-200 rounded-lg text-center shadow-xl mb-1">
            <p>{{ date }}</p>
          </div>
          <div class="flex bg-red-50 rounded-lg shadow-xl flex-wrap">
            <div
              class="m-2"
              v-for="item in getItemsByDate(date)"
              :key="item.id"
            >
              <div class="stats shadow">
                <div class="stat">
                  <p>
                    {{ item.title }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 캐로셀 해결하려면 router 방식 이용해야 될 듯!

import { ref, onMounted, watchEffect, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  getPlanDetail,
  getPlan,
  deletePlanData,
  getGalleryWithPlanID,
} from '@/utils/api/plan';
import Swal from 'sweetalert2';
const route = useRoute();
const planDetail = ref('');
const planGalleryList = ref([]);
const currentId = ref('');
const planInfoDetail = ref([]);
const dateList = ref([]);
const router = useRouter();

const getItemsByDate = date => {
  return planInfoDetail.value.filter(item => item.date === date);
};
const getCurrentRouteId = () => {
  currentId.value = route.params.id;
};
const defaultCenter = { lat: 36.10680122096389, lng: 128.4178078082704 };

const map = ref(null);
const initMap = async () => {
  // 기본 좌표로 지도 생성
  map.value = new google.maps.Map(document.getElementById('googleMap'), {
    center: defaultCenter,
    zoom: 15,
  });
  // 여행 좌표에 마커 추가
  const bounds = new google.maps.LatLngBounds();

  watch(planInfoDetail.value, (newvalue, oldvalue) => {
    newvalue.forEach(data => {
      if (map.value) {
      }
      const customMarkerImage =
        'https://longdssafy.s3.ap-northeast-2.amazonaws.com/a40b8994-d5fb-4cc2-87ce-610b09d3f340heart-suit.png';

      const marker = new google.maps.Marker({
        position: { lat: data.latitude, lng: data.longitude },
        map: map.value,
        title: '되나?',
        icon: {
          url: customMarkerImage,
          scaledSize: new google.maps.Size(30, 30), // 그림의 크기 조절
        },
      });

      const location = new google.maps.LatLng(data.latitude, data.longitude);
      bounds.extend(location);
    });

    // 모든 마커를 추가한 후에 fitBounds 호출
    map.value.fitBounds(bounds);
  });
};
function generateDateList(startDate, endDate) {
  const dateList = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    dateList.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateList;
}

const deletePlan = function () {
  Swal.fire({
    title: '삭제하시겠습니까?',
    showCancelButton: true,
    confirmButtonText: '예',
    cancelButtonText: '아니오',
  }).then(result => {
    if (result.isConfirmed) {
      // 사용자가 '예'를 눌렀을 때의 로직
      deletePlanData(
        currentId.value,
        success => {
          router.push({ name: 'PlanList' });
          // 삭제 성공 시 추가적인 로직 작성
        },
        fail => {
          console.error(fail);
          // 삭제 실패 시 추가적인 로직 작성
        },
      );
    }
    // '아니오'를 눌렀을 때는 아무 로직도 추가하지 않음
  });
};
//리스트로 돌려보낼함수
const goList = function () {
  router.push({ name: 'PlanList' });
};
// 컴포넌트가 마운트될 때와 라우터의 변경을 감지하여 현재 ID를 업데이트합니다.

// const slides = ref([]);

// const initSlides = () => {
//   planGalleryList.value.forEach(item => {
//     slides.value.push({ imageUrl: item.pathUrl });
//     console.log(slides.value);
//   });
// };

onMounted(async () => {
  await initMap();
  getCurrentRouteId();
  getPlanDetail(
    currentId.value,
    success => {
      success.data.forEach(element => {
        planInfoDetail.value.push(element);
      });
    },
    error => {
      console.error(error);
    },
  );
  getPlan(currentId.value, success => {
    planDetail.value = success.data;
    dateList.value = generateDateList(
      success.data.dateStart,
      success.data.dateEnd,
    );
  });
  getGalleryWithPlanID(
    currentId.value,
    success => {
      planGalleryList.value = success.data;
      // initSlides();
    },
    error => {
      console.error(error);
    },
  );
  getPlan(currentId.value, success => {
    planDetail.value = success.data;
    dateList.value = generateDateList(
      success.data.dateStart,
      success.data.dateEnd,
    );
  });
});
watchEffect(getCurrentRouteId);
</script>

<style scoped>
p {
  font-size: larger;
  font-weight: 600;
}
.googleMap {
  height: 600px;
  width: 100%;
}

div[aria-hidden='true'] {
  display: none;
}

div[aria-hidden='false'] {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

div[aria-hidden='false'] > div {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}
</style>
