import store from "@/store";

export default function checkPerssion(key) {
  if (store.getters.buttons) {
    return store.getters.buttons.includes(key);
  } else {
    return false;
  }
}
