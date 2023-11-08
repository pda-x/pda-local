import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Avue from "@smallwei/avue";
import ElementPlus from "element-plus";
import axios from "axios";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "element-plus/dist/index.css";
import "@smallwei/avue/lib/index.css";
import "./style.css";

const app = createApp(App);

app.use(router);

app.use(ElementPlus, {
  locale: zhCn,
  size: "large",
});

app.use(Avue, {
  axios,
  menuType: "button",
  size: "large",
  submitBtn: false,
  emptyBtn: false,
  labelPosition: "top",
});

app.mount("#app");
