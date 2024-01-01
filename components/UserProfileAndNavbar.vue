<script setup lang="ts">
import { ref } from "vue";

export interface UserData {
  sub: string;
  username: string;
  email: string;
  role: "BROKER" | "CLIENT";
}

const config = useRuntimeConfig();
const router = useRouter();
const userDataRef = ref<UserData | null>(null);
const isLoadingRef = ref<boolean>(true);

const endpointRoute = `${config.public.BASE_URL}/auth/user`;

async function getUserData() {
  const token = localStorage.getItem("token");

  const response = await $fetch(endpointRoute, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response as UserData;
}

await getUserData()
  .then((response) => {
    userDataRef.value = response;
    isLoadingRef.value = false;
    return;
  })
  .catch(() => {
    logout();
  });

function logout() {
  if (process.client) {
    localStorage.removeItem("token");
    localStorage.removeItem("expiresIn");
    router.push("/");
  }
}
</script>

<template>
  <div
    class="w-full text-white bg-indigo-800 p-8 flex flex-col md:flex-row gap-y-8 justify-between items-center"
  >
    <div class="flex flex-col" v-if="!isLoadingRef">
      <h1 class="font-bold text-4xl">
        Bem vindo, {{ userDataRef?.username }}
        <span class="text-2xl font-semibold"
          >({{
            userDataRef?.role[0] === "BROKER"
              ? "Corretor de seguro"
              : "Cliente"
          }})</span
        >
      </h1>
      <h2 class="font-medium text-xl">{{ userDataRef?.email }}</h2>
    </div>
    <div class="flex flex-col">
      <button
        type="submit"
        aria-label="Deslogar"
        class="bg-indigo-400 font-bold text-black hover:bg-indigo-500 text-lg p-2 rounded transition"
        @click="logout"
      >
        Deslogar
      </button>
    </div>
  </div>
  <nav
    class="bg-indigo-900 text-white p-4 md:px-24 flex flex-row justify-center items-center gap-8"
  >
    <router-link
      to="/dashboard"
      class="font-bold text-lg hover:text-indigo-100 transition"
    >
      Início
    </router-link>
    <router-link
      to="/brokers"
      class="font-bold text-lg hover:text-indigo-100 transition"
      v-if="userDataRef?.role[0] === 'BROKER'"
    >
      Corretores
    </router-link>
    <router-link
      to="/clients"
      class="font-bold text-lg hover:text-indigo-100 transition"
      v-if="userDataRef?.role[0] === 'BROKER'"
    >
      Clientes
    </router-link>
  </nav>
</template>
