<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1
              class="text-xl font-semibold bg-orange-600 px-3 py-2 rounded-xl text-white"
            >
              Game Management System
            </h1>
          </div>
          <nav class="flex space-x-4">
            <NuxtLink
              to="/"
              class="decoration-none text-dark-600 hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Game List
            </NuxtLink>
            <NuxtLink
              to="/register"
              class="bg-emerald-600 decoration-none text-white hover:bg-emerald-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
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
