<template>
  <div>
    <div class="mb-6">
      <div class="flex items-center gap-4 mb-4">
        <Button
          icon="pi pi-arrow-left"
          severity="secondary"
          outlined
          @click="navigateBack"
          title="Back to Game List"
        />
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">
            {{ pageTitle }}
          </h2>
          <p class="text-gray-600">
            {{ pageDescription }}
          </p>
        </div>
      </div>
    </div>

    <div class="max-w-4xl">
      <Card>
        <template #content>
          <form @submit.prevent="submitForm" class="space-y-6">
            <!-- Game ID Section -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Game ID <span class="text-red-500">*</span>
              </label>
              <InputText
                v-model="form.id"
                :disabled="isEditMode"
                placeholder="e.g., UNCHARTED4"
                class="w-full"
                :class="{ 'p-invalid': errors.id }"
                @blur="validateField('id')"
              />
              <small v-if="errors.id" class="p-error">{{ errors.id }}</small>
              <small v-show="!isEditMode" class="text-gray-500">
                Unique identifier for the game (cannot be changed after
                creation)
              </small>
            </div>

            <!-- Category Section -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Category <span class="text-red-500">*</span>
              </label>
              <Dropdown
                v-model="form.category"
                :options="categoryOptions"
                option-label="label"
                option-value="value"
                placeholder="Select a category"
                class="w-full"
                :class="{ 'p-invalid': errors.category }"
                @change="validateField('category')"
              />
              <small v-if="errors.category" class="p-error">{{
                errors.category
              }}</small>
            </div>

            <!-- Multilingual Names Section -->
            <div>
              <div class="flex justify-between items-center mb-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Game Names <span class="text-red-500">*</span>
                  </label>
                  <small class="text-gray-500">
                    Add game names in different languages
                  </small>
                </div>
                <Dropdown
                  v-model="selectedLanguageToAdd"
                  :options="availableLanguages"
                  option-label="label"
                  option-value="value"
                  placeholder="Add Language"
                  class="w-48"
                  @change="addLanguageEntry"
                />
              </div>

              <div v-show="errors.names" class="mb-4">
                <small class="p-error">{{ errors.names }}</small>
              </div>

              <div class="space-y-4">
                <Card
                  v-for="(nameEntry, index) in form.name"
                  :key="nameEntry.language"
                  class="border border-gray-200"
                >
                  <template #content>
                    <div class="flex items-start gap-4">
                      <div class="flex-shrink-0 pt-2">
                        <Tag
                          :value="getLanguageLabel(nameEntry.language)"
                          :severity="getLanguageTagSeverity(nameEntry.language)"
                        />
                      </div>

                      <div class="flex-1">
                        <InputText
                          v-model="nameEntry.value"
                          :placeholder="`Enter game name in ${getLanguageLabel(
                            nameEntry.language
                          )}`"
                          class="w-full"
                          :class="{ 'p-invalid': errors[`name_${index}`] }"
                          @blur="validateNameEntry(index)"
                        />
                        <small v-if="errors[`name_${index}`]" class="p-error">
                          {{ errors[`name_${index}`] }}
                        </small>
                      </div>

                      <div class="flex items-center gap-2 pt-2">
                        <Button
                          v-show="!nameEntry.isDefault"
                          icon="pi pi-star"
                          severity="warning"
                          outlined
                          size="small"
                          @click="setDefaultLanguage(index)"
                          title="Set as Default"
                        />
                        <Tag
                          v-show="nameEntry.isDefault"
                          value="Default"
                          severity="warning"
                          class="text-xs"
                        />

                        <Button
                          v-show="form.name.length > 1"
                          icon="pi pi-trash"
                          severity="danger"
                          outlined
                          size="small"
                          @click="removeLanguageEntry(index)"
                          title="Remove Language"
                        />
                      </div>
                    </div>
                  </template>
                </Card>

                <div
                  v-show="form.name.length === 0"
                  class="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg"
                >
                  <i class="pi pi-plus-circle text-3xl text-gray-400 mb-2"></i>
                  <p class="text-gray-500">No languages added yet</p>
                  <p class="text-gray-400 text-sm">
                    Use the dropdown above to add a language
                  </p>
                </div>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="flex justify-end gap-3 pt-6 border-t">
              <Button
                label="Cancel"
                severity="secondary"
                outlined
                @click="navigateBack"
                :disabled="submitting"
              />
              <Button
                type="submit"
                :label="submitButtonLabel"
                :loading="submitting"
                :disabled="!isFormValid"
              />
            </div>
          </form>
        </template>
      </Card>
    </div>

    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useNuxtApp } from "#app";
import type { Game, GameName } from "~/types/game";
import { useToast } from "primevue/usetoast";

const route = useRoute();
const toast = useToast();

// Form data
const form = ref({
  id: "",
  category: "",
  name: [] as (GameName & { isDefault?: boolean })[],
});

const errors = ref<Record<string, string>>({});
const submitting = ref(false);
const loading = ref(false);
const selectedLanguageToAdd = ref("");

// Edit mode detection
const isEditMode = computed(() => !!route.query.id);
const gameId = computed(() => route.query.id as string);

const pageTitle = computed(() =>
  isEditMode.value ? "Edit Game" : "Register New Game"
);
const pageDescription = computed(() =>
  isEditMode.value
    ? "Update game information"
    : "Add a new game to your collection"
);
const submitButtonLabel = computed(() =>
  isEditMode.value ? "Update Game" : "Create Game"
);

// Language options
const languageOptions = [
  { label: "English", value: "EN" },
  { label: "Korean", value: "KO" },
  { label: "Japanese", value: "JA" },
];

const categoryOptions = [
  { label: "All Categories", value: null },
  { label: "Action", value: "ACTION" },
  { label: "Adventure", value: "ADVENTURE" },
  { label: "Fighting", value: "FIGHTING" },
  { label: "FPS", value: "FPS" },
  { label: "Puzzle", value: "PUZZLE" },
  { label: "RPG", value: "RPG" },
  { label: "Racing", value: "RACING" },
  { label: "Rhythm", value: "RYTHM" },
  { label: "Rougelite", value: "ROUGELITE" },
  { label: "Simulation", value: "SIMULATION" },
  { label: "Strategy", value: "STRATEGY" },
  { label: "Sports", value: "SPORTS" },
];

// Available languages (not yet added)
const availableLanguages = computed(() => {
  const usedLanguages = form.value.name.map((n) => n.language);
  return languageOptions.filter((lang) => !usedLanguages.includes(lang.value));
});

// Form validation
const isFormValid = computed(() => {
  return (
    form.value.id.trim() !== "" &&
    form.value.category !== "" &&
    form.value.name.length > 0 &&
    form.value.name.every((n) => n.value.trim() !== "") &&
    Object.keys(errors.value).length === 0
  );
});

const navigateBack = () => {
  navigateTo("/");
};

const loadGameForEdit = async () => {
  if (!isEditMode.value) return;

  loading.value = true;
  try {
    const response = await fetch(`/api/games/${gameId.value}`);
    const game = await response.json();

    if (!response.ok) {
      throw new Error(game.message || "Failed to load game");
    }

    form.value.id = game.id;
    form.value.category = game.category;
    form.value.name = game.name.map((nameEntry: GameName, index: number) => ({
      ...nameEntry,
      isDefault: index === 0, // First entry is default
    }));
  } catch (error) {
    console.error("Error loading game:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to load game data",
      life: 3000,
    });
    navigateBack();
  } finally {
    loading.value = false;
  }
};

const addLanguageEntry = () => {
  if (!selectedLanguageToAdd.value) return;

  const isFirst = form.value.name.length === 0;
  form.value.name.push({
    language: selectedLanguageToAdd.value as "EN" | "KO" | "JA",
    value: "",
    isDefault: isFirst,
  });

  selectedLanguageToAdd.value = "";
  clearErrors();
};

const removeLanguageEntry = (index: number) => {
  const removedEntry = form.value.name[index];
  form.value.name.splice(index, 1);

  // If we removed the default language, set the first remaining as default
  if (removedEntry.isDefault && form.value.name.length > 0) {
    form.value.name[0].isDefault = true;
  }

  clearErrors();
};

const setDefaultLanguage = (index: number) => {
  form.value.name.forEach((entry, i) => {
    entry.isDefault = i === index;
  });
};

const getLanguageLabel = (language: string) => {
  return (
    languageOptions.find((lang) => lang.value === language)?.label || language
  );
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

const validateField = (field: string) => {
  delete errors.value[field];

  switch (field) {
    case "id":
      if (!form.value.id.trim()) {
        errors.value.id = "Game ID is required";
      } else if (!/^[A-Z0-9_]+$/.test(form.value.id)) {
        errors.value.id =
          "Game ID must contain only uppercase letters, numbers, and underscores";
      }
      break;
    case "category":
      if (!form.value.category) {
        errors.value.category = "Category is required";
      }
      break;
  }
};

const validateNameEntry = (index: number) => {
  const key = `name_${index}`;
  delete errors.value[key];

  if (!form.value.name[index]?.value.trim()) {
    errors.value[key] = "Game name is required";
  }
};

const validateForm = () => {
  clearErrors();

  validateField("id");
  validateField("category");

  if (form.value.name.length === 0) {
    errors.value.names = "At least one game name is required";
  } else {
    form.value.name.forEach((_, index) => {
      validateNameEntry(index);
    });
  }

  return Object.keys(errors.value).length === 0;
};

const clearErrors = () => {
  errors.value = {};
};

const submitForm = async () => {
  if (!validateForm()) return;

  submitting.value = true;
  try {
    // Sort names so default is first
    const sortedNames = [...form.value.name].sort((a, b) => {
      if (a.isDefault) return -1;
      if (b.isDefault) return 1;
      return 0;
    });

    const gameData = {
      id: form.value.id.trim().toUpperCase(),
      category: form.value.category,
      name: sortedNames.map(({ language, value }) => ({
        language,
        value: value.trim(),
      })),
    };

    let response;
    if (isEditMode.value) {
      response = await fetch(`/api/games/${gameId.value}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: gameData.category,
          name: gameData.name,
        }),
      });
    } else {
      response = await fetch("/api/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gameData),
      });
    }

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to save game");
    }

    toast.add({
      severity: "success",
      summary: "Success",
      detail: isEditMode.value
        ? "Game updated successfully"
        : "Game created successfully",
      life: 3000,
    });

    navigateBack();
  } catch (error: any) {
    console.error("Error submitting form:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail:
        error.message ||
        `Failed to ${isEditMode.value ? "update" : "create"} game`,
      life: 3000,
    });
  } finally {
    submitting.value = false;
  }
};

// Lifecycle
const initializeForm = () => {
  if (isEditMode.value) {
    loadGameForEdit();
  } else {
    // Reset form for new game
    form.value = {
      id: "",
      category: "",
      name: [],
    };
    clearErrors();
  }
};

onMounted(() => {
  initializeForm();
});

// Watch for route changes
watch(
  () => route.query.id,
  () => {
    initializeForm();
  }
);
</script>
