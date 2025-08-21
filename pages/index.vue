<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-dark-800 mb-2">Game List</h2>
        <p class="text-gray-600">Manage your game collection</p>
      </div>
      <div class="flex gap-3">
        <Button
          icon="pi pi-trash"
          :label="deleteButtonLabel"
          @click="confirmBulkDelete"
          :loading="bulkDeleting"
          :disabled="!hasSelectedGames"
        />
        <Button
          icon="pi pi-plus"
          label="Register New Game"
          @click="navigateToRegister"
        />
      </div>
    </div>
    <Card class="mb-6">
      <template #content>
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <label class="block text-sm font-large text-white-700 mb-2">
              Search Games
            </label>
            <InputText
              placeholder="Search by name or ID"
              class="w-full"
              @input=""
            />
          </div>
          <div class="flex-1">
            <label class="block text-sm font-large text-white-700 mb-2">
              Filter by Genre
            </label>
            <Dropdown
              :options="categoriesOptions"
              option-label="label"
              option-value="value"
              placeholder="Select Category"
              show-clear
              class="w-full"
              @change=""
            />
          </div>
        </div>
      </template>
    </Card>

    <Card>
      <template #content>
        <DataTable
          v-model:selection="selectedGames"
          :value="games"
          :loading="loading"
          selection-mode="multiple"
          data-key="id"
          :meta-key-selection="false"
          class="p-datatable-sm"
          :row="pageSize"
          :total-records="totalRecords"
          lazy
          paginator
          :rows-per-page-options="[5, 10, 20]"
          paginator-template="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          current-page-report-template="{first} to {last} of {totalRecords} games"
          @page="onPageChange"
          @sort="onSort"
        >
          <template #empty>
            <div class="text-center py-8">
              <i class="pi pi-search text-4xl text-gray-400 mb-4"></i>
              <p class="text-gray-500 text-lg mb-2">No games found</p>
              <p class="text-gray-400">Try adjusting your search criteria</p>
            </div>
          </template>
          <template #loading>
            <div class="text-center py-8">
              <i class="pi pi-spin pi-spinner text-2xl text-primary-500"></i>
              <p class="text-gray-500 mt-2">Loading games...</p>
            </div>
          </template>
          <Column selection-mode="multiple" headerStyle="width: 3em" />
          <Column field="id" header="Game ID" sortable>
            <template #body="{ data }">
              <NuxtLink
                :to="`/games/${data.id}`"
                class="text-blue-600 hover:underline"
              >
                {{ data.id }}
              </NuxtLink>
            </template>
          </Column>
          <Column field="name" header="Game Name" sortable>
            <template #body="{ data }">
              <div class="space-y-1">
                <div
                  v-for="nameEntry in data.name"
                  :key="nameEntry.language"
                  class="flex items-center gap-2"
                >
                  <Tag
                    :value="nameEntry.language"
                    :severity="getLanguageTagSeverity(nameEntry.language)"
                    class="text-xs"
                  />
                  <span class="text-sm">{{ nameEntry.value }}</span>
                </div>
              </div>
            </template>
          </Column>

          <Column field="category" header="Category" sortable>
            <template #body="{ data }">
              <Tag
                :value="data.category"
                :severity="getCategoryTagSeverity(data.category)"
              />
            </template>
          </Column>

          <Column header="Actions" :exportable="false" style="min-width: 8rem">
            <template #body="{ data }">
              <div class="flex gap-2">
                <Button
                  icon="pi pi-pencil"
                  severity="info"
                  size="small"
                  @click="() => editGame(data)"
                  :title="`Edit ${data.name[0]?.value || data.id}`"
                />
                <Button
                  icon="pi pi-trash"
                  severity="danger"
                  size="small"
                  @click="() => confirmDelete(data)"
                  :title="`Delete ${data.name[0]?.value || data.id}`"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
    <ConfirmDialog />
    <Toast />
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Game } from "~/types/game";

const { $toast, $confirm } = useNuxtApp();

const games = ref<Game[]>([]);
const selectedGames = ref<Game[]>([]);
const loading = ref(false);
const bulkDeleting = ref(false);
const searchQuery = ref("");
const selectedCategory = ref("");
const currentPage = ref(1);
const pageSize = ref(10);
const totalRecords = ref(0);

const hasSelectedGames = computed(() => selectedGames.value.length > 0);
const deleteButtonLabel = computed(() => {
  return hasSelectedGames.value
    ? `Delete (${selectedGames.value.length})`
    : "Delete";
});
const categoriesOptions = [
  { label: "All Categories", value: null },
  { label: "Action", value: "ACTION" },
  { label: "Adventure", value: "ADVENTURE" },
  { label: "Fighting", value: "FIGHTING" },
  { label: "Puzzle", value: "PUZZLE" },
  { label: "RPG", value: "RPG" },
  { label: "Racing", value: "RACING" },
  { label: "Sports", value: "SPORTS" },
  { label: "Strategy", value: "STRATEGY" },
];
const navigateToRegister = () => {
  navigateTo("/register");
};
let searchTimeout: NodeJS.Timeout | null = null;
const handleSearchInput = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    currentPage.value = 1;
    loadGames();
  }, 400);
};
const loadGames = async () => {
  loading.value = true;
  try {
    const params = new URLSearchParams({
      page: currentPage.value.toString(),
      limit: pageSize.value.toString(),
    });

    if (searchQuery.value.trim()) {
      params.append("search", searchQuery.value.trim());
    }

    if (selectedCategory.value) {
      params.append("category", selectedCategory.value);
    }

    const response = await fetch(`/api/games?${params.toString()}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to load games");
    }

    games.value = data.games;
    totalRecords.value = data.total;
  } catch (error) {
    console.error("Error loading games:", error);
    $toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to load games",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};
const onPageChange = (event: any) => {
  currentPage.value = event.page + 1;
  pageSize.value = event.rows;
  loadGames();
};

const onSort = () => {
  loadGames();
};

const editGame = (game: Game) => {
  navigateTo(`/register?id=${game.id}`);
};

const confirmDelete = (game: Game) => {
  $confirm.require({
    message: `Are you sure you want to delete "${
      game.name[0]?.value || game.id
    }"?`,
    header: "Delete Confirmation",
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Delete",
      severity: "danger",
    },
    accept: () => deleteGame(game.id),
  });
};

const deleteGame = async (gameId: string) => {
  try {
    const response = await fetch(`/api/games/${gameId}`, { method: "DELETE" });

    if (!response.ok) {
      throw new Error("Failed to delete game");
    }

    $toast.add({
      severity: "success",
      summary: "Success",
      detail: "Game deleted successfully",
      life: 3000,
    });
    await loadGames();
    selectedGames.value = selectedGames.value.filter((g) => g.id !== gameId);
  } catch (error) {
    console.error("Error deleting game:", error);
    $toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to delete game",
      life: 3000,
    });
  }
};

const confirmBulkDelete = () => {
  const count = selectedGames.value.length;
  $confirm.require({
    message: `Are you sure you want to delete ${count} selected game${
      count > 1 ? "s" : ""
    }?`,
    header: "Bulk Delete Confirmation",
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Delete All",
      severity: "danger",
    },
    accept: () => bulkDeleteGames(),
  });
};

const bulkDeleteGames = async () => {
  bulkDeleting.value = true;
  try {
    const gameIds = selectedGames.value.map((game) => game.id);
    const response = await fetch("/api/games", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: gameIds }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete games");
    }

    $toast.add({
      severity: "success",
      summary: "Success",
      detail: data.message,
      life: 3000,
    });

    selectedGames.value = [];
    await loadGames();
  } catch (error) {
    console.error("Error bulk deleting games:", error);
    $toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to delete selected games",
      life: 3000,
    });
  } finally {
    bulkDeleting.value = false;
  }
};

const getLanguageTagSeverity = (language: string) => {
  switch (language) {
    case "EN":
      return "info";
    case "KO":
      return "success";
    case "JA":
      return "warning";
    default:
      return "secondary";
  }
};

const getCategoryTagSeverity = (category: string) => {
  switch (category) {
    case "ADVENTURE":
      return "info";
    case "RPG":
      return "success";
    case "SHOOTER":
      return "danger";
    case "STRATEGY":
      return "warning";
    case "SPORTS":
      return "help";
    case "RACING":
      return "secondary";
    case "PUZZLE":
      return "contrast";
    case "ACTION":
      return "danger";
    default:
      return "secondary";
  }
};

// Lifecycle
onMounted(() => {
  loadGames();
});
</script>
