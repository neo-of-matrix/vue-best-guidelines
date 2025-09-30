import type { InjectionKey, Ref } from "vue";
const themeKey = Symbol() as InjectionKey<Ref<string>>;
export { themeKey };