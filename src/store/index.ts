import { createPinia } from 'pinia';
import { markRaw } from 'vue';
import router from '@/router';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();

pinia.use(({ store }) => {
  store.$router = markRaw(router);
});

pinia.use(piniaPluginPersistedstate);

export default pinia;
