import { ref } from "vue";

const userId = ref();
const messages = ref();
const userInfo = ref();

export const useStore = () => {
  return {
    userId,
    messages,
    userInfo
  };
};
