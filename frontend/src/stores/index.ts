import { createStore } from 'vuex'
import menuLinks from './menus';
import { cloneDeep, isNull } from 'lodash';
import localStorage from 'reactive-localstorage';

const { VITE_APP_NAME }       = import.meta.env;
const app_session_auth:  any  = localStorage.getItem(`${VITE_APP_NAME.replaceAll(' ','')}_AUTH`);

// Create a new store instance.
export default createStore({
  actions:{
    logout({ commit },$router){
      localStorage.setItem(`${VITE_APP_NAME.replaceAll(' ','')}_AUTH`,JSON.stringify({}));
      $router.push({ name: "AdminLogin" });
    }
  },
  state: () => {
    return {
      auth: {},
      cart: Array(),
      get env(){ return import.meta.env },
      home:{
        categories: Array(),
        company:    Object()
      },
      loader: false,
      sideBar:{
        menus:     menuLinks,
        visible:   true,
      }
    }
  },
  getters:{
    auth:              (state) => state.auth,
    cart:              (state) => state.cart,
    env:               (state) => state.env,
    home:              (state) => state.home,
    loader:            (state) => state.loader,
    sidebarMenus:      (state) => state.sideBar.menus,
    sidebarUnfoldable: (state) => state.sideBar.unfoldable,
    sidebarVisible:    (state) => state.sideBar.visible,
  },
  mutations: {
    auth(state,value) {
      state.auth = value;
    },
    cart(state,value) {
      state.cart = cloneDeep(value);
    },
    home(state,value) {
      state.home = value
    },
    loader(state,value) {
      state.loader = value
    },
    toggleSidebar(state) {
      state.sideBar.visible = !state.sideBar.visible
    },
    toggleUnfoldable(state) {
      state.sideBar.unfoldable = !state.sideBar.unfoldable
    },
    updateSidebarVisible(state, payload) {
      state.sideBar.visible = payload.value
    },
  },
});