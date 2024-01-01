<script setup lang="ts">
import { ref } from "vue";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { AccountEntity } from "../../utils/types/Account.type";
import type { UserData } from "~/components/UserProfileAndNavbar.vue";

useHead({
  title: "Corretores",
});

definePageMeta({
  name: "brokers",
  layout: "restrict",
  middleware: "auth",
});

const config = useRuntimeConfig();
const router = useRouter();

const pending = ref<boolean>(true);
const brokers = ref<AccountEntity[]>([]);
const userData = ref<UserData | null>(null);

onMounted(async () => {
  await fetchBrokers();
});

const fetchBrokers = async () => {
  const token = localStorage.getItem("token");
  const userDataRoute = `${config.public.BASE_URL}/auth/user`;
  const brokersRoute = `${config.public.BASE_URL}/broker`;

  const userDataResponse = await $fetch(userDataRoute, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  userData.value = userDataResponse as UserData;

  if (userData.value.role[0] !== "BROKER") {
    return router.push("/dashboard");
  }

  const response = await $fetch(brokersRoute, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  brokers.value = response as AccountEntity[];
  pending.value = false;
};

const deleteBroker = async () => {
  const deleteBrokerRoute = `${config.public.BASE_URL}/broker`;
  const token = localStorage.getItem("token");

  await $fetch(deleteBrokerRoute, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiresIn");
    router.push("/");
  });
};

const formUsername = ref<string>("");
const formEmail = ref<string>("");
const formPassword = ref<string>("");
const error = ref<string | null>(null);

const createUser = async () => {
  error.value = null;
  const token = localStorage.getItem("token");
  const createBrokerRoute = `${config.public.BASE_URL}/broker`;

  await $fetch(createBrokerRoute, {
    method: "POST",
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
      await fetchBrokers();
      formUsername.value = "";
      formEmail.value = "";
      formPassword.value = "";
    })
    .catch((errorCatch) => {
      const statusCode = errorCatch.data.statusCode;

      if (statusCode === 409) {
        error.value = "Um corretor com o mesmo nome ou e-mail já existe.";
        return;
      }

      error.value = "Você digitou um campo errado.";
    });
};
</script>

<template>
  <div v-if="!pending" class="w-full flex flex-col justify-center items-center">
    <div
      class="mt-16 w-full md:w-1/2 lg:w-1/4 p-8 flex flex-col justify-center items-center bg-indigo-900 rounded-lg"
    >
      <h1 class="text-2xl font-bold text-white mb-8">Seu perfil - ações</h1>
      <h2>Nome de usuário: {{ userData?.username }}</h2>
      <h2>E-mail: {{ userData?.email }}</h2>
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <nuxt-link to="/profile/update">
          <button
            type="button"
            aria-label="Atualizar perfil"
            class="p-2 mt-4 bg-indigo-600 transition hover:bg-indigo-700 rounded font-semibold"
          >
            Atualizar perfil
          </button>
        </nuxt-link>
        <AlertDialog>
          <AlertDialogTrigger as-child>
            <button
              type="button"
              aria-label="Deletar a minha conta"
              class="p-2 mt-4 bg-red-600 transition hover:bg-red-700 rounded font-semibold"
            >
              Deletar a minha conta
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Essa ação é <strong>irreversível</strong>, ao clicar em
                confirmar, sua conta será permanentemente deletada e você será
                deslogado.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction @click="deleteBroker">
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>

    <div
      className="mt-8 w-full md:w-1/2 lg:w-1/4 p-8 flex flex-col justify-center items-center bg-indigo-900 rounded-lg"
    >
      <h1 class="text-2xl font-bold text-white mb-8">Criar corretor</h1>
      <form
        @submit.prevent="createUser"
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
          aria-label="Criar"
          class="mt-2 bg-indigo-600 hover:bg-indigo-700 transition p-4 w-full text-lg font-bold rounded"
        >
          Criar
        </button>
      </form>
    </div>

    <div
      className="mt-8 w-full p-8 flex flex-col justify-center items-center bg-indigo-900 rounded-lg"
    >
      <h1 class="text-2xl font-bold text-white mb-8">Corretores</h1>
      <Table>
        <TableCaption>Todos os corretores disponíveis no sistema</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Nome de usuário</TableHead>
            <TableHead>E-mail</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(broker, index) in brokers">
            <TableCell>{{ index + 1 }}</TableCell>
            <TableCell>{{ broker.username }}</TableCell>
            <TableCell>{{ broker.email }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>
