<script setup lang="js">
import { ID, Permission, Role } from 'appwrite';
import { databases } from './appwrite-lib.js'
const sendMessage = () => {
  appwrite.databases.createDocument(
    import.meta.env.VITE_APPWRITE_DB,
    import.meta.env.VITE_APPWRITE_COLLECTION,
    ID.unique(),
    message,
    [Permission.read(Role.user($userId))]
  );
};
</script>
<template></template>
