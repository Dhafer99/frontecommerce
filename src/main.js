import { createApp } from 'vue';
import App from './App.vue';
import router from './router';


import Aura from '@primevue/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast'; // Import Toast component
import '@/assets/styles.scss';
import '@/assets/tailwind.css';
import { createPinia } from 'pinia';


const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
});
app.use(ToastService);
app.use(createPinia)
app.component('Toast', Toast); // Register the Toast component
app.use(ConfirmationService);

app.mount('#app');
