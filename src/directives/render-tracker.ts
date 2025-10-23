import type { Directive } from "vue";

export type renderTrackerDirectiveType = Directive<HTMLElement, string>;

declare module "vue" {
  export interface ComponentCustomProperties {
    vRenderTracker: renderTrackerDirectiveType;
  }
}

export default {
  mounted: (el) => {
    console.log("元素首次渲染:", el);
  },
  updated: (el) => {
    console.log("元素重新渲染:", el);
  },
} satisfies renderTrackerDirectiveType;
