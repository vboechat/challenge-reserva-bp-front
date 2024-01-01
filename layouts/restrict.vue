<script lang="ts">
export default {
  name: "restrict",
};
</script>

<template>
  <div class="min-h-screen bg-zinc-950 text-white">
    <header>
      <UserProfileAndNavbar />
    </header>
    <main class="flex">
      <slot />
    </main>
  </div>
</template>
