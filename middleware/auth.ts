export default defineNuxtRouteMiddleware(() => {
  if (process.client) {
    const token = localStorage.getItem("token");
    const expiresIn = localStorage.getItem("expiresIn");

    if (!token || !expiresIn) {
      return navigateTo("/");
    }

    const expiresInIsoString = new Date(expiresIn).toISOString();
    const actualDate = new Date().toISOString();

    if (actualDate > expiresInIsoString) {
      return navigateTo("/");
    }
  }
});
