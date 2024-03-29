import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
export const useUserStore = defineStore('user', () => {
  const userState = ref();

  const getUserState = computed(() => {
    return userState.value;
  });

  const setUserState = function (state) {
    userState.value = state;
  };

  const isLogin = computed(
    () =>
      !(
        userState.value === '롱디에 로그인 되어 있지 않음' ||
        userState.value === '' ||
        userState.value === null
      ),
  );

  return { userState, getUserState, setUserState, isLogin };
});
