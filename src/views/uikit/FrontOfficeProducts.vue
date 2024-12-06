<script setup>
import productService from '@/services/productService';
import { onMounted, ref, watch } from 'vue';

// Reactive variables
const products = ref([]);
const filteredProducts = ref([]);
const picklistProducts = ref([]);
const orderlistProducts = ref([]);
const options = ref(['list', 'grid']);
const layout = ref('list');

// Filters
const selectedSousCategorie = ref([]);
const fieldFilters = ref({});
const sousCategories = ref([]);
const availableFields = ref({});
const selectedFieldValues = ref({});

// Fetch products and initialize filters
onMounted(() => {
  productService.getProducts().then((data) => {
    products.value = data.data.slice(0, 6);
    filteredProducts.value = products.value;

    // Initialize sousCategories
    const categories = products.value.map((p) => p.sousCategorie);
    sousCategories.value = [
      ...new Map(categories.map((item) => [item.name, item])).values(),
    ];

    // Initialize availableFields and selectedFieldValues
    const allFields = products.value.flatMap((p) => Object.entries(p.fields || {}));
    availableFields.value = allFields.reduce((acc, [key, value]) => {
      if (!acc[key]) {
        acc[key] = new Set();
      }
      acc[key].add(value);
      return acc;
    }, {});
    Object.keys(availableFields.value).forEach((key) => {
      availableFields.value[key] = Array.from(availableFields.value[key]);
    });
    selectedFieldValues.value = Object.fromEntries(
      Object.keys(availableFields.value).map((field) => [field, ''])
    );
  });
});

// Watch for changes in filters and update `filteredProducts`
watch(
  [selectedSousCategorie, selectedFieldValues],
  () => {
    filteredProducts.value = products.value.filter((product) => {
      // Filter by sousCategorie (multi-select)
      if (
        selectedSousCategorie.value.length > 0 &&
        !selectedSousCategorie.value.includes(product.sousCategorie.name)
      ) {
        return false;
      }

      // Filter by fields
      for (const [key, value] of Object.entries(selectedFieldValues.value)) {
        if (value && product.fields[key]?.toLowerCase() !== value.toLowerCase()) {
          return false;
        }
      }

      return true;
    });
  },
  { deep: true }
);

// Clear Filters
function clearFilters() {
  selectedSousCategorie.value = [];
  Object.keys(selectedFieldValues.value).forEach((field) => {
    selectedFieldValues.value[field] = '';
  });
}

// Get severity for inventory status
function getSeverity(product) {
  switch (product.inventoryStatus) {
    case 'INSTOCK':
      return 'success';
    case 'LOWSTOCK':
      return 'warning';
    case 'OUTOFSTOCK':
      return 'danger';
    default:
      return null;
  }
}
</script>

<template>
    <div class="grid grid-cols-12 gap-4">
      <!-- Sidebar -->
      <aside class="col-span-12 lg:col-span-3 bg-surface-100 p-4 rounded">
        <div class="filters mb-6">
          <!-- Sous-Categorie Filter -->
          <div>
            <label for="sousCategorie" class="block font-semibold mb-2">Sous-Categorie</label>
            <div id="sousCategorie" class="p-2 border rounded">
              <div v-for="sousCat in sousCategories" :key="sousCat.id" class="flex items-center space-x-2">
                <input
                  type="checkbox"
                  :id="`sousCat-${sousCat.id}`"
                  :value="sousCat.name"
                  v-model="selectedSousCategorie"
                  class="form-checkbox"
                />
                <label :for="`sousCat-${sousCat.id}`">{{ sousCat.name }}</label>
              </div>
            </div>
          </div>
  
          <!-- Dynamic Field Filters -->
          <div v-for="(values, field) in availableFields" :key="field" class="mt-4">
            <label class="block font-semibold mb-2">{{ field }}</label>
            <div class="flex gap-2 flex-wrap">
              <button
                v-for="value in values"
                :key="value"
                @click="selectedFieldValues[field] = selectedFieldValues[field] === value ? '' : value"
                class="p-2 border rounded"
                :class="{
                  'bg-blue-500 text-white': selectedFieldValues[field] === value,
                  'bg-gray-200': selectedFieldValues[field] !== value
                }"
              >
                {{ value }}
              </button>
            </div>
          </div>
  
          <!-- Clear Filters Button -->
          <button @click="clearFilters" class="w-full mt-4 p-2 bg-blue-500 text-white rounded">
            Clear Filters
          </button>
        </div>
      </aside>
  
      <!-- Main Content -->
      <main class="col-span-12 lg:col-span-9">
        <DataView :value="filteredProducts" :layout="layout">
          <!-- Header Section with Layout Toggle -->
          <template #header>
            <div class="flex justify-between items-center mb-6">
              <div class="flex justify-end">
                <SelectButton v-model="layout" :options="options" :allowEmpty="false">
                  <template #option="{ option }">
                    <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-table']" />
                  </template>
                </SelectButton>
              </div>
            </div>
          </template>
  
          <!-- List Layout -->
          <template #list="slotProps">
            <div class="flex flex-col">
              <div v-for="(item, index) in slotProps.items" :key="index">
                <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4" :class="{ 'border-t border-surface': index !== 0 }">
                  <!-- Image Section -->
                  <div class="md:w-40 relative">
                    <img class="block xl:block mx-auto rounded w-full" :src="item.images[0]" :alt="item.name" />
                    <Tag :value="item.inventoryStatus" :severity="getSeverity(item)" class="absolute dark:!bg-surface-900" style="left: 4px; top: 4px"></Tag>
                  </div>
  
                  <!-- Product Details -->
                  <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                    <div>
                      <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ item.category }}</span>
                      <div class="text-lg font-medium mt-2">{{ item.name }}</div>
                    </div>
                    <div class="bg-surface-100 p-1" style="border-radius: 30px">
                      <div
                        class="bg-surface-0 flex items-center gap-2 justify-center py-1 px-2"
                        style="border-radius: 30px; box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.04), 0px 1px 2px 0px rgba(0, 0, 0, 0.06);"
                      >
                        <span class="text-surface-900 font-medium text-sm">{{ item.rating }}</span>
                        <i class="pi pi-star-fill text-yellow-500"></i>
                      </div>
                    </div>
                  </div>
  
                  <div class="flex flex-col md:items-end gap-8">
                    <span class="text-xl font-semibold">${{ item.price }}</span>
                    <div class="flex flex-row-reverse md:flex-row gap-2">
                      <Button icon="pi pi-heart" outlined></Button>
                      <Button icon="pi pi-shopping-cart" label="Reserver maintenant ! " :disabled="item.inventoryStatus === 'OUTOFSTOCK'" class="flex-auto md:flex-initial whitespace-nowrap"></Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
  
          <!-- Grid Layout -->
          <template #grid="slotProps">
            <div class="grid grid-cols-12 gap-4">
              <div v-for="(item, index) in slotProps.items" :key="index" class="col-span-12 sm:col-span-6 lg:col-span-4 p-2">
                <div class="p-6 border rounded flex flex-col">
                  <div class="bg-surface-50 flex justify-center rounded p-4">
                    <img class="rounded w-full" :src="item.images[0]" :alt="item.name" style="object-fit: contain; max-height: 300px;" />
                  </div>
                  <div class="pt-6">
                    <div class="text-lg font-medium">{{ item.name }}</div>
                    <span class="text-2xl font-semibold">${{ item.price }}</span>
                    <div class="flex flex-row-reverse md:flex-row gap-2">
                      <Button icon="pi pi-heart" outlined></Button>
                      <Button icon="pi pi-shopping-cart" label="Reserver maintenant ! " :disabled="item.inventoryStatus === 'OUTOFSTOCK'" class="flex-auto md:flex-initial whitespace-nowrap"></Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </DataView>
      </main>
    </div>
  </template>
  