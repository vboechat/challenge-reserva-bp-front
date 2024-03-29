<script setup lang="ts">
interface ApiResponse {
  token: string;
  expiresIn: number;
}

import { ref } from "vue";
import { useRuntimeConfig } from "nuxt/app";

useHead({
  title: "Login",
});

const config = useRuntimeConfig();
const router = useRouter();

const formEmail = ref<string>("");
const formPassword = ref<string>("");
const isLoading = ref<boolean>(false);
const hasError = ref<boolean>(false);

const handleSubmit = async () => {
  isLoading.value = true;
  hasError.value = false;

  const endpointRoute = `${config.public.BASE_URL}/auth/login`;

  const form = {
    email: formEmail.value,
    password: formPassword.value,
  };

  await $fetch(endpointRoute, {
    method: "POST",
    body: JSON.stringify(form),
  })
    .then((response) => {
      const { token, expiresIn } = response as ApiResponse;

      if (token) {
        const expireInDate = getExpireInDate(expiresIn);

        localStorage.setItem("token", token);
        localStorage.setItem("expiresIn", expireInDate);

        router.push("/dashboard");
      }
      return;
    })
    .catch(() => (hasError.value = true));

  isLoading.value = false;
};
</script>

<template>
  <main class="min-h-screen bg-zinc-950 flex justify-center items-center">
    <div
      class="flex flex-col gap-y-4 w-4/6 min-h-screen justify-center items-center"
    >
      <form
        class="flex flex-col gap-4 w-full lg:w-1/3 p-4 bg-zinc-800 rounded-lg"
        @submit.prevent="handleSubmit"
      >
        <span class="text-5xl text-center text-zinc-100 mb-4">Autenticar</span>
        <input
          v-model="formEmail"
          type="email"
          placeholder="Seu e-mail"
          class="p-2 bg-zinc-600 rounded focus:outline-none focus:ring-4 focus:ring-indigo-500 placeholder:text-white text-white font-semibold"
        />
        <input
          v-model="formPassword"
          type="password"
          placeholder="Sua senha"
          class="p-2 bg-zinc-600 rounded focus:outline-none focus:ring-4 focus:ring-indigo-500 placeholder:text-white text-white font-semibold"
        />
        <button
          type="submit"
          :aria-label="isLoading ? 'Carregando...' : 'Entrar'"
          :disabled="isLoading"
          class="bg-green-600 font-bold text-lg p-2 rounded self-center hover:bg-green-800 hover:text-white transition"
        >
          {{ isLoading ? "Carregando..." : "Entrar" }}
        </button>
        <span v-if="hasError" class="text-red-600 self-center font-bold text-sm"
          >Credenciais inválidas</span
        >
      </form>
    </div>
  </main>
</template>
