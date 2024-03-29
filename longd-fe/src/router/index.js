import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import ProfileView from '@/components/main/ProfileView.vue';
import ProfileCorrectionView from '@/components/main/ProfileCorrectionView.vue';
import ProfilePartnerView from '@/components/main/ProfilePartnerView.vue';
import GalleryListView from '@/views/gallery/GalleryListView.vue';
import GalleryDetailView from '@/views/gallery/GalleryDetailView.vue';
import CalendarView from '@/views/calendar/CalendarView.vue';
import ViduMainView from '@/views/openvidu/ViduMainView.vue';
import ViduVideoView from '@/views/openvidu/ViduVideoView.vue';
import MapView from '@/views/map/MapView.vue';
import MapSearch from '@/components/plan/MapSearch.vue';
import MapPlan from '@/components/plan/MapPlan.vue';
import PlanListView from '@/views/map/PlanListView.vue';
import PlanDetailView from '@/views/map/PlanDetailView.vue';
import ClosedView from '@/views/main/ClosedView.vue';
import LoginSignUpView from '@/views/main/LoginSignUpView.vue';
import RequiredInfoView from '@/views/main/RequiredInfoView.vue';
import ConnectCodeView from '@/components/main/ConnectCodeView.vue';
import GalleryFolderView from '@/views/gallery/GalleryFolderView.vue';
import bucketListView from '@/views/bucketList/bucketListView.vue';
import VideoListView from '@/views/gallery/VideoListView.vue';
import { useUserStore } from '@/stores/user.js';
import { loginstate } from '@/utils/api/user';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/requiredinfo',
      name: 'RequiredInfo',
      component: RequiredInfoView,
    },
    {
      path: '/connectcode',
      name: 'ConnectCode',
      component: ConnectCodeView,
    },
    {
      path: '/profile',
      name: 'Profile',
      component: ProfileView,
    },
    {
      path: '/profile/correction',
      name: 'profileCorrection',
      component: ProfileCorrectionView,
    },
    {
      path: '/profile/partner',
      name: 'PartnerInfo',
      component: ProfilePartnerView,
    },
    {
      path: '/gallery',
      name: 'GalleryFolder',
      component: GalleryFolderView,
    },
    {
      path: '/gallery/:folderName',
      name: 'GalleryList',
      component: GalleryListView,
    },
    {
      path: '/gallery/:folderName/:id',
      name: 'GalleryDetail',
      component: GalleryDetailView,
    },
    {
      path: '/gallery/video',
      name: 'VideoList',
      component: VideoListView,
    },
    {
      path: '/calendar',
      name: 'Calendar',
      component: CalendarView,
    },
    {
      path: '/vidumain',
      name: 'ViduMain',
      component: ViduMainView,
    },
    {
      path: '/viduVideo',
      name: 'ViduVideo',
      component: ViduVideoView,
    },
    {
      path: '/map',
      name: 'Map',
      component: MapView,
      redirect: '/map/search',
      // /map에 접근하면 자동으로 /map/search로 리다이렉트
      children: [
        {
          path: 'search',
          name: 'MapSearch',
          component: MapSearch,
        },
        {
          path: 'plan',
          name: 'MapPlan',
          component: MapPlan,
        },
      ],
      // children 안 path에는 /를 사용하면 안된다 => 절대경로가 되어버려서!
      // children 안에 children을 만들 수도 있다
    },
    {
      path: '/plan/list',
      name: 'PlanList',
      component: PlanListView,
    },
    {
      path: '/plan/list/:id',
      name: 'PlanDetail',
      component: PlanDetailView,
    },
    {
      path: '/closed',
      name: 'Closed',
      component: ClosedView,
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginSignUpView,
    },
    {
      path: '/bucketList',
      name: 'bucketList',
      component: bucketListView,
    },
  ],
});
router.beforeEach((to, from, next) => {
  if (to.name === 'Login' || to.name === 'RequiredInfo') {
    next();
    return;
  }
  const userStore = useUserStore();
  loginstate(
    async data => {
      await userStore.setUserState(data.data);
      if (!userStore.isLogin) {
        next({ name: 'Login' });
      } else {
        if (userStore.getUserState.coupleListId !== null) {
          if (to.name === 'ConnectCode') {
            next('/');
            return;
          }
          next();
        } else {
          if (to.name === 'ConnectCode') {
            next();
            return;
          } else {
            next({ name: 'ConnectCode' });
          }
        }
      }
    },
    error => {
      console.log('Profile을 가져올 수 없습니다.', error);
    },
  );
});
export default router;
