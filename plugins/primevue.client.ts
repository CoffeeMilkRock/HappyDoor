import { defineNuxtPlugin } from "nuxt/app";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dropdown from "primevue/dropdown";
import Dialog from "primevue/dialog";
import Toast from "primevue/toast";
import ToastService from "primevue/toastservice";
import ConfirmDialog from "primevue/confirmdialog";
import ConfirmationService from "primevue/confirmationservice";
import Paginator from "primevue/paginator";
import Checkbox from "primevue/checkbox";
import Card from "primevue/card";
import Textarea from "primevue/textarea";
import Tag from "primevue/tag";
import Tooltip from "primevue/tooltip";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        prefix: "p",
        darkModeSelector: ".dark",
        cssLayer: false,
      },
    },
  });

  nuxtApp.vueApp.use(ToastService);
  nuxtApp.vueApp.use(ConfirmationService);

  nuxtApp.vueApp.directive("tooltip", Tooltip);

  // Register components
  nuxtApp.vueApp.component("Button", Button);
  nuxtApp.vueApp.component("InputText", InputText);
  nuxtApp.vueApp.component("DataTable", DataTable);
  nuxtApp.vueApp.component("Column", Column);
  nuxtApp.vueApp.component("Dropdown", Dropdown);
  nuxtApp.vueApp.component("Dialog", Dialog);
  nuxtApp.vueApp.component("Toast", Toast);
  nuxtApp.vueApp.component("ConfirmDialog", ConfirmDialog);
  nuxtApp.vueApp.component("Paginator", Paginator);
  nuxtApp.vueApp.component("Checkbox", Checkbox);
  nuxtApp.vueApp.component("Card", Card);
  nuxtApp.vueApp.component("Textarea", Textarea);
  nuxtApp.vueApp.component("Tag", Tag);

  return {
    provide: {
      toast: nuxtApp.vueApp.config.globalProperties.$toast,
      confirm: nuxtApp.vueApp.config.globalProperties.$confirm,
    },
  };
});
