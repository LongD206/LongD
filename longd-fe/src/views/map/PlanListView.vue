<template>
  <AppGrid class="mb-10" :items="planList">
    <template v-slot="{ item }">
      <PlanCard
        :id="item.id"
        :title="item.title"
        :dateStart="item.dateStart"
        :dateEnd="item.dateEnd"
        @click="goDetail(item.id)"
      >
      </PlanCard>
    </template>
  </AppGrid>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { getPlanList } from '@/utils/api/plan';
import { useRouter } from 'vue-router';
import PlanCard from '@/components/plan/PlanCard.vue';
import AppGrid from '@/components/app/AppGrid.vue';
const router = useRouter();

const userStore = useUserStore();

const userInfo = ref();
const planList = ref();

onMounted(async () => {
  userInfo.value = userStore.getUserState;

  getPlanList(
    userStore.getUserState.coupleListId,
    success => {
      planList.value = success.data;
    },
    error => {
      console.log('플랜 리스트 에러', error);
    },
  );
});

const goDetail = id => {
  router.push({ name: 'PlanDetail', params: { id: id } });
};
</script>

<style scoped></style>
