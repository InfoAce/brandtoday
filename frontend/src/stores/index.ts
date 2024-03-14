import { createStore } from 'vuex'
import menuLinks from './menus';
import { cloneDeep, isNull } from 'lodash';

const { VITE_APP_NAME }       = import.meta.env;
const app_session_auth:  any  = localStorage.getItem(`${VITE_APP_NAME.replaceAll(' ','')}_AUTH`);

// Create a new store instance.
export default createStore({
  state: () => {
    return {
      auth: {
        token: Object.assign({}, !isNull(app_session_auth) ? JSON.parse(atob(app_session_auth)).token : {} ),
        user:  Object.assign({}, !isNull(app_session_auth) ? JSON.parse(atob(app_session_auth)).user :  {} )
      },
      cart: Array(),
      get env(){ return import.meta.env },
      loader: false,
      sideBar:{
        menus:      menuLinks,
        visible:   true,
        unfoldable: false
      }
    }
  },
  getters:{
    authToken:         (state) => state.auth.token,
    authUser:          (state) => state.auth.user,
    cart:              (state) => state.cart,
    env:               (state) => state.env,
    loader:            (state) => state.loader,
    sidebarMenus:      (state) => state.sideBar.menus,
    sidebarUnfoldable: (state) => state.sideBar.unfoldable,
    sidebarVisible:    (state) => state.sideBar.visible,
  },
  mutations: {
    auth(state,value) {
      localStorage.setItem(`${VITE_APP_NAME.replaceAll(' ','')}_AUTH`, btoa(JSON.stringify(value)));
    },
    cart(state,value) {
      state.cart = cloneDeep(value);
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