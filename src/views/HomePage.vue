<template>
  <ion-page v-if="userId !== undefined">
    <ion-header :translucent="true" v-if="userId">
      <ion-toolbar>
        <ion-title>AppWrite Chat</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="doLogout">LOGOUT</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <template v-if="userId">
      <ion-content class="ion-padding">
        <div v-for="chat in messages" :key="chat.$id" class="chat-bubble">
          <div class="message">
            <span v-if="chat?.owner === userId" style="font-weight: bold"
              >ME</span
            >
            <span v-else style="font-weight: bold">{{
              chat?.displayName
            }}</span>
            {{ chat?.message }}
            <div class="chat-date">{{ formatDate(chat?.$updatedAt) }}</div>
          </div>
        </div>
      </ion-content>
      <ion-footer>
        <ion-item>
          <ion-input type="text" v-model="messageText"></ion-input>
          <ion-button :disabled="!messageText" @click="sendMessage"
            >Send</ion-button
          >
        </ion-item>
      </ion-footer>
    </template>
    <template v-else-if="!userId">
      <ion-content class="ion-padding">
        <div style="padding-top: 160px">
          <h1 style="text-align: center; margin-bottom: 32px">
            Simple AppWrite Chat
          </h1>
          <ion-button
            expand="block"
            style="margin-bottom: 16px"
            @click="showLogin = true"
          >
            LOGIN
          </ion-button>
          <ion-button expand="block" @click="showSignUp = true"
            >SIGN UP</ion-button
          >
        </div>

        <ion-modal :is-open="showLogin">
          <login-modal
            mode="LOGIN"
            @on-dismiss="showLogin = false"
            @on-action="handleLogin"
          />
        </ion-modal>

        <ion-modal :is-open="showSignUp">
          <login-modal
            mode="SIGNUP"
            @on-dismiss="showSignUp = false"
            @on-action="handleSignUp"
          />
        </ion-modal>
      </ion-content>
    </template>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButton,
  IonFooter,
  IonItem,
  IonButtons,
  IonModal,
} from "@ionic/vue";
import { nextTick, onMounted, ref } from "vue";
import { appwrite } from "../appwrite-lib.js";
import { useStore } from "../useStore.js";
import { Permission, Query, Role } from "appwrite";
import LoginModal from "../components/LoginModal.vue";

const messageText = ref("");
const showLogin = ref(false);
const showSignUp = ref(false);

const { messages, userId, userInfo } = useStore();

/**
 * 
 * @param date 
 */
const formatDate = (date: string) => {
  const dateTime = new Date(date);
  return dateTime.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * 
 */
const doLogout = async () => {
  await appwrite.account.deleteSessions();
  userId.value = null;
  messages.value = null;
};

/**
 *
 * @param data
 */
const handleLogin = async (data: any) => {
  try {
    console.log(data);
    showLogin.value = false;
    const session = await appwrite.account.createEmailSession(
      data?.email,
      data?.password
    );
    if (session) {
      userId.value = await getSession();

      // load the data
      await load();
    }
  } catch (error) {
    console.log(error);
    alert((error as Error).message);
  }
};

/**
 *
 * @param data
 */
const handleSignUp = async (data: any) => {
  try {
    console.log(data);
    showSignUp.value = false;
    const user = await appwrite.account.create(
      appwrite.ID.unique(),
      data?.email,
      data?.password,
      data?.displayName
    );

    if (user) {
      const session = await appwrite.account.createEmailSession(
        data?.email,
        data?.password
      );
      userId.value = await getSession();
    }
  } catch (error) {
    console.log(error);
    alert((error as Error).message);
  }
};

/**
 * 
 */
const sendMessage = async () => {
  if (!messageText.value || !userId.value) return;

  appwrite.databases.createDocument(
    import.meta.env.VITE_APPWRITE_DB,
    import.meta.env.VITE_APPWRITE_COLLECTION,
    appwrite.ID.unique(),
    {
      message: messageText.value,
      owner: userId.value,
      displayName: userInfo?.value.name,
    },
    [Permission.read(Role.users()), Permission.delete(Role.user(userId.value))]
  );
  messageText.value = "";
};

/**
 * check if we have an authenticated user
 */
const getSession = async () => {
  try {
    const user = await appwrite.account.get();
    userInfo.value = user;
    return user.$id;
  } catch (error) {
    return null;
  }
};

/**
 * load chat messages into store for use in display
 */
const load = async () => {
  const { messages } = useStore();
  try {
    const { documents } = await appwrite.databases.listDocuments(
      import.meta.env.VITE_APPWRITE_DB,
      import.meta.env.VITE_APPWRITE_COLLECTION,
      [Query.orderAsc('$updatedAt')]
    );

    console.log(documents);
    messages.value = documents;
    return documents
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  // check for user...
  const session = await getSession();
  userId.value = session;

  // if user get data
  if (userId.value) {
    await load();
  }

  // listen for changes to chat collection
  appwrite.client.subscribe(
    `databases.${import.meta.env.VITE_APPWRITE_DB}.collections.${
      import.meta.env.VITE_APPWRITE_COLLECTION
    }.documents`,
    async ({ payload, events }) => {
      // await sleep(1000);
      let prev = messages?.value || [];
      messages.value = [...prev,payload ];
    }
  );
});
</script>

<style scoped>
.chat {
  margin-bottom: 8px;
}

.chat-bubble {
  display: flex;
  align-items: center;
  padding: 8px;
  margin-bottom: 10px;
}

.message {
  background-color: #e4e4e4;
  padding: 10px;
  border-radius: 16px;
  margin-right: 10px;
}

.chat-date {
  font-size: smaller;
  margin-top: 8px;
}

.avatar img {
  width: 36px;
  height: 36px;
}
</style>
