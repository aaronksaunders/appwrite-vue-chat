import { Account, Client, Databases, ID } from "appwrite";

const client = new Client();
client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT);

  console.log(client);

export const appwrite = {
  client,
  account: new Account(client),
  databases: new Databases(client),
  ID
};
