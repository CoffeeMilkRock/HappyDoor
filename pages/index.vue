<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-dark-800 mb-2">Game List</h2>
        <p class="text-gray-600">Manage your game collection</p>
      </div>
    </div>
    <div class="flex gap-3">
      <Button icon="pi pi-trash" label="delete" />
      <Button icon="pi pi-plus" label="Register New Game" />
    </div>
  </div>
</template>
<script setup>
import Button from "primevue/button";
</script>
