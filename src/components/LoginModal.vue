<template>
  <ion-page>
    <ion-content>
      <ion-item v-if="mode === 'SIGNUP'">
        <ion-input type="text" v-model="displayName"></ion-input>
      </ion-item>
      <ion-item>
        <ion-input type="email" v-model="email"></ion-input>
      </ion-item>

      <ion-item>
        <ion-input type="password" v-model="password"></ion-input>
      </ion-item>
      <ion-button @click="emits('onAction', { email, password, displayName })">
        {{ mode === 'SIGNUP' ? "SIGN UP" : "LOGIN" }}
      </ion-button>
      <ion-button @click="emits('onDismiss')">CANCEL</ion-button>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import { IonContent, IonInput, IonButton, IonItem, IonPage } from "@ionic/vue";
import { ref } from "vue";

// PROPS
const props = defineProps<{
  mode: "LOGIN" | "SIGNUP";
}>();
const emits = defineEmits<{
  (event: "onDismiss"): void;
  (event: "onAction", { email: string, password: string }): void;
}>();

const email = ref("");
const password = ref("");
const displayName = ref("");
</script>
<style></style>
