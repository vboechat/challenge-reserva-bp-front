<script setup lang="ts">
import type { UserData } from "~/components/UserProfileAndNavbar.vue";

useHead({
  title: "Schedule",
});

definePageMeta({
  name: "Schedule",
  layout: "restrict",
  middleware: "auth",
});

interface BrokerResponse {
  id: string;
  username: string;
  email: string;
  role: "BROKER";
  createdAt: string;
  updatedAt: string;
}

const config = useRuntimeConfig();
const routes = useRoute();
const router = useRouter();
const brokerId = routes.params.id;

const user = ref<UserData | null>(null);
const broker = ref<Omit<BrokerResponse, "role"> | null>(null);
const pending = ref<boolean>(true);
const error = ref<string | null>(null);

const formDate = ref<string>("");
const formFromTime = ref<string>("");
const formDuration = ref<number>(0);

onMounted(async () => {
  const brokerEndpointRoute = `${config.public.BASE_URL}/broker/${brokerId}`;
  const userDataEndpointRoute = `${config.public.BASE_URL}/auth/user`;
  const token = localStorage.getItem("token");

  const userDataResponse = await $fetch(userDataEndpointRoute, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  user.value = userDataResponse as UserData;

  if (user.value.role[0] !== "CLIENT") {
    return router.push("/dashboard");
  }

  const brokerResponse = await $fetch(brokerEndpointRoute, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  broker.value = brokerResponse as Omit<BrokerResponse, "role">;
  pending.value = false;
});

const handleSubmit = async () => {
  error.value = null;
  const formDateData = getSchedulesTime(
    formDate.value,
    formFromTime.value,
    formDuration.value
  );

  const scheduleEndpointRoute = `${config.public.BASE_URL}/schedules`;

  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

  const brokerId = Number(routes.params.id);

  const body = JSON.stringify({
    fromDate: formDateData.fromTime,
    toDate: formDateData.toTime,
    brokerId,
  });

  $fetch(scheduleEndpointRoute, {
    method: "POST",
    headers,
    body,
  })
    .then(() => {
      return router.push("/dashboard");
    })
    .catch((errorCatch) => {
      const statusCode = errorCatch.data.statusCode;

      if (statusCode === 409) {
        error.value = "O corretor está ocupado durante esse horário";
        return;
      }

      error.value = "Você provavelmente tentou agendar um horário no passado";
    });
};
</script>

<template>
  <div v-if="!pending" class="w-full flex flex-col justify-center items-center">
    <div
      className="mt-16 p-8 flex flex-col max-w-xl justify-center items-center bg-indigo-900 rounded-lg"
    >
      <h1 class="text-2xl font-bold text-white break-all">
        Reservar horário com o corretor {{ broker?.username }} (#{{ brokerId }})
      </h1>
      <form
        @submit.prevent="handleSubmit"
        class="flex flex-col justify-start items-start w-full mt-2"
      >
        <label for="schedule-date" class="text-lg font-semibold"
          >Data e hora de início da consulta</label
        >
        <input
          type="date"
          id="schedule-date"
          v-model="formDate"
          :min="new Date().toISOString().split('T')[0]"
          class="w-full p-2 bg-zinc-600 rounded"
          required
        />
        <label for="schedule-from-time" class="text-lg font-semibold mt-4"
          >Hora de início da consulta</label
        >
        <input
          type="time"
          id="schedule-from-time"
          v-model="formFromTime"
          class="w-full p-2 bg-zinc-600 rounded"
          required
        />
        <label for="schedule-duration" class="text-lg font-semibold mt-4"
          >Duração da consulta</label
        >
        <small class="font-semibold text-sm">Escolha de 30 a 120 minutos</small>
        <input
          type="number"
          min="30"
          max="120"
          id="schedule-duration"
          v-model="formDuration"
          class="w-full p-2 bg-zinc-600 rounded"
          required
        />
        <small class="mt-2"
          >Todos os horários são no horário de Brasília (UTC-03:00).</small
        >
        <span class="text-red-500 font-bold" v-if="error !== null">{{
          error
        }}</span>
        <button
          type="submit"
          class="mt-2 bg-indigo-600 hover:bg-indigo-700 transition p-4 w-full text-lg font-bold rounded"
        >
          Reservar
        </button>
      </form>
    </div>
  </div>
</template>
