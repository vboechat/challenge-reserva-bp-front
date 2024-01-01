<script setup lang="ts">
import { format } from "date-fns";
import type { UserData } from "~/components/UserProfileAndNavbar.vue";
import type { AccountEntity } from "~/utils/types/Account.type";

useHead({
  title: "Dashboard",
});

definePageMeta({
  name: "Dashboard",
  layout: "restrict",
  middleware: "auth",
});

interface SchedulesResponse {
  id: string;
  brokerId: string;
  clientId: string;
  client: AccountEntity;
  fromDate: string;
  toDate: string;
  createdAt: string;
  updatedAt: string;
}

const config = useRuntimeConfig();

const user = ref<UserData | null>(null);
const brokers = ref<Array<Omit<AccountEntity, "role">>>([]);
const schedules = ref<Array<SchedulesResponse>>([]);
const pending = ref<boolean>(true);

const formatDate = (date: string) => format(new Date(date), "dd/MM/yyyy HH:mm");
const findBrokerById = (id: string) => {
  const broker = brokers.value.find((broker) => broker.id === id);

  return broker?.username;
};

onMounted(async () => {
  const brokersEndpointRoute = `${config.public.BASE_URL}/broker`;
  const schedulesEndpointRoute = `${config.public.BASE_URL}/schedules`;
  const userDataEndpointRoute = `${config.public.BASE_URL}/auth/user`;
  const token = localStorage.getItem("token");

  const [brokersResponse, schedulesResponse, userDataResponse] =
    await Promise.all([
      $fetch(brokersEndpointRoute, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      $fetch(schedulesEndpointRoute, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      $fetch(userDataEndpointRoute, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    ]);

  brokers.value = brokersResponse as Array<Omit<AccountEntity, "role">>;
  schedules.value = schedulesResponse as Array<SchedulesResponse>;
  user.value = userDataResponse as UserData;
  pending.value = false;
});

const sortedSchedules = computed(() => {
  return schedules.value.sort((a, b) => {
    return new Date(b.fromDate).getTime() - new Date(a.fromDate).getTime();
  });
});
</script>

<template>
  <div className="p-8 w-full">
    <h1 v-if="user?.role[0] === 'CLIENT'" class="text-white text-2xl">
      Corretores disponíveis
    </h1>
    <div
      v-if="!pending"
      class="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 w-full gap-4"
    >
      <div
        v-if="user?.role[0] === 'CLIENT'"
        v-for="broker in brokers"
        :key="broker.id"
        class="bg-indigo-900 p-4 rounded flex flex-col justify-center items-start flex-wrap"
      >
        <h2 class="font-bold break-all">
          Corretor {{ broker.username }} (#{{ broker.id }})
        </h2>
        <h3 class="break-all">E-mail: {{ broker.email }}</h3>
        <router-link
          :to="`/schedule/broker/${broker.id}`"
          class="font-bold text-lg hover:text-indigo-100 transition pt-4"
        >
          Reservar horário
        </router-link>
      </div>
    </div>
    <h2 v-if="!pending" className="text-white text-2xl mt-4">Seus horários</h2>
    <div
      v-if="!pending"
      class="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 w-full gap-4"
    >
      <div
        v-for="schedule in sortedSchedules"
        :key="schedule.id"
        class="bg-indigo-900 p-4 rounded flex flex-col justify-center items-start flex-wrap"
      >
        <h2 class="font-bold break-all" v-if="user?.role[0] === 'CLIENT'">
          Corretor {{ findBrokerById(schedule.brokerId) }} (#{{
            schedule.brokerId
          }})
        </h2>
        <h2 class="font-bold break-all" v-else>
          Cliente {{ schedule.client.username }} (#{{ schedule.client.id }})
        </h2>
        <h3>De: {{ formatDate(schedule.fromDate) }}</h3>
        <h3>Até: {{ formatDate(schedule.toDate) }}</h3>
        <h3
          class="font-bold mt-2 text-red-400"
          v-if="schedule.toDate < new Date().toISOString()"
        >
          EXPIRADO/FINALIZADO
        </h3>
      </div>
    </div>
  </div>
</template>
