<script setup lang="ts">
import { ref } from "vue";
import type { AccountEntity } from "../../../utils/types/Account.type";
import type { UserData } from "~/components/UserProfileAndNavbar.vue";

useHead({
  title: "Atualizar perfil cliente",
});

definePageMeta({
  layout: "restrict",
  middleware: "auth",
});

const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();
const clientId = route.params.id;

const pending = ref<boolean>(true);
const userData = ref<UserData | null>(null);
const clientData = ref<AccountEntity | null>(null);

onMounted(async () => {
  await fetchData();
});

const fetchData = async () => {
  const token = localStorage.getItem("token");
  const userDataRoute = `${config.public.BASE_URL}/auth/user`;
  const clientDataRoute = `${config.public.BASE_URL}/clients/${clientId}`;

  const userDataResponse = await $fetch(userDataRoute, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  userData.value = userDataResponse as UserData;

  if (userData.value.role[0] !== "BROKER") {
    return router.push("/dashboard");
  }

  const clientDataResponse = await $fetch(clientDataRoute, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  clientData.value = clientDataResponse as AccountEntity;
  formUsername.value = clientData.value.username;
  formEmail.value = clientData.value.email;
  pending.value = false;
};

const formUsername = ref<string>("");
const formEmail = ref<string>("");
const formPassword = ref<string>("");
const error = ref<string | null>(null);

const editUser = async () => {
  error.value = null;
  const token = localStorage.getItem("token");
  const editClientRoute = `${config.public.BASE_URL}/clients/${clientId}`;

  await $fetch(editClientRoute, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: {
      username: formUsername.value,
      email: formEmail.value,
      password: formPassword.value,
    },
  })
    .then(async () => {
      router.push("/clients");
    })
    .catch((errorCatch) => {
      const statusCode = errorCatch.data.statusCode;

      if (statusCode === 409) {
        error.value = "Um usuário com o mesmo nome ou e-mail já existe.";
        return;
      }

      error.value = "Você digitou um campo errado.";
    });
};
</script>

<template>
  <div v-if="!pending" class="w-full flex flex-col justify-center items-center">
    <div
      className="mt-8 w-full md:w-1/2 lg:w-1/4 p-8 flex flex-col justify-center items-center bg-indigo-900 rounded-lg"
    >
      <h1 class="text-2xl font-bold text-white">Editar perfil</h1>
      <form
        @submit.prevent="editUser"
        class="flex flex-col justify-start items-start w-full mt-2"
      >
        <label for="username" class="text-lg font-semibold">
          Nome de usuário
        </label>
        <input
          type="text"
          id="username"
          v-model="formUsername"
          class="w-full p-2 bg-zinc-600 rounded"
          required
        />
        <label for="email" class="text-lg font-semibold mt-4">E-mail</label>
        <input
          type="email"
          id="email"
          v-model="formEmail"
          class="w-full p-2 bg-zinc-600 rounded"
          required
        />
        <label for="password" class="text-lg font-semibold mt-4">Senha</label>
        <input
          type="password"
          id="password"
          v-model="formPassword"
          class="w-full p-2 bg-zinc-600 rounded"
          required
        />
        <span class="text-red-500 font-bold" v-if="error !== null">
          {{ error }}
        </span>
        <button
          type="submit"
          aria-label="Confirmar"
          class="mt-2 bg-indigo-600 hover:bg-indigo-700 transition p-4 w-full text-lg font-bold rounded"
        >
          Confirmar
        </button>
      </form>
    </div>
  </div>
</template>
