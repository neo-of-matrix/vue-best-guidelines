import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { renderTracker } from "./directives";

const app = createApp(App);
app.directive("renderTracker", renderTracker);
app.mount("#app");