<template>
  <div class="max-[640px]:mx-0 bg-gray-50">
    <header class="bg-white shadow-sm border-b">
      <div class="mx-auto px-4 max-[640px]:px-3 px-6">
        <div
          class="flex justify-between max-[640px]:justify-around items-center h-16"
        >
          <div class="flex items-center">
            <NuxtLink
              to="/"
              class="max-[640px]:text-md text-xl decoration-none font-bold text-dark-600 transition-colors"
            >
              GameManager
            </NuxtLink>
          </div>
          <nav class="max-[640px]:text-sm flex space-x-4">
            <NuxtLink
              to="/"
              class="max-[640px]:hidden decoration-none text-dark-600 hover:text-gray-500 px-3 py-2 rounded-md text-sm font-bold transition-colors"
            >
              Game List
            </NuxtLink>
            <NuxtLink
              to="/register"
              class="max-[640px]:text-sm bg-dark-700 font-bold decoration-none text-white hover:bg-gray-700 px-4 py-2 rounded-md text-sm transition-colors"
            >
              Register Game
            </NuxtLink>
          </nav>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>
