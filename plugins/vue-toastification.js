import { createApp } from 'vue';
import Toast, { POSITION } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

export default defineNuxtPlugin((nuxtApp) => {
  const app = createApp(nuxtApp.vueApp);
  const options = {
    position: POSITION.TOP_RIGHT,
  };
  app.use(Toast, options);
});
