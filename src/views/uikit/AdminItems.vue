<script setup>
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import PanelMenu from "primevue/panelmenu";

// Toast for notifications
const toast = useToast();

// Reactive state for dialogs and data
const dialogVisible = ref(false);
const addProductDialog = ref(false);
const selectedSuperCategory = ref(null);
const selectedCategory = ref(null);
const currentContext = ref(null);
const newProduct = ref({ name: "", price: "", quantity: "" });
const formData = ref({ id: null, name: "" });

// Super Categories Data
const superCategories = ref([
  {
    id: "1",
    name: "Electronics",
    categories: [
      {
        id: "1-1",
        name: "Phones",
        fields: ["Ram", "Size", "Color", "Battery Life"],
        sousCategories: [
          { id: "1-1-1", name: "Smartphones", products: [] },
          { id: "1-1-2", name: "Feature Phones", products: [] },
        ],
      },
      {
        id: "1-2",
        name: "Laptops",
        fields: ["Ram", "Size", "Color", "Battery Life"],
        sousCategories: [
          { id: "1-2-1", name: "Gaming Laptops", products: [] },
          { id: "1-2-2", name: "Business Laptops", products: [] },
        ],
      },
    ],
  },
]);

// PanelMenu Data
const categoriesModel = ref([]);

// Transform Super Categories into PanelMenu Format
const transformToPanelMenu = () => {
  categoriesModel.value = superCategories.value.map((superCategory) => ({
    label: superCategory.name,
    items: superCategory.categories.map((category) => ({
      label: category.name,
      items: category.sousCategories.map((sousCategory) => ({
        label: sousCategory.name,
      })),
    })),
  }));
};
transformToPanelMenu();

// Open Dialog for Adding Entities
const openDialog = (context) => {
  currentContext.value = context; // Context: 'superCategory', 'category', 'sousCategory'
  formData.value = { id: null, name: "" };
  selectedSuperCategory.value = null;
  selectedCategory.value = null;
  dialogVisible.value = true;
};

const addToastMessage = (severity, summary, detail) =>
  toast.add({ severity, summary, detail });

const saveEntity = () => {
  if (currentContext.value === "superCategory") {
    superCategories.value.push({
      id: Date.now().toString(),
      name: formData.value.name,
      categories: [],
    });
    addToastMessage("success", "Super Category Added", `Super category "${formData.value.name}" added.`);
  } else if (currentContext.value === "category") {
    if (!selectedSuperCategory.value) {
      addToastMessage("error", "Error", "Please select a Super Category.");
      return;
    }
    selectedSuperCategory.value.categories.push({
      id: Date.now().toString(),
      name: formData.value.name,
      sousCategories: [],
    });
    addToastMessage("success", "Category Added", `Category "${formData.value.name}" added to ${selectedSuperCategory.value.name}.`);
  } else if (currentContext.value === "sousCategory") {
    if (!selectedSuperCategory.value || !selectedCategory.value) {
      addToastMessage("error", "Error", "Please select a Super Category and Category.");
      return;
    }
    selectedCategory.value.sousCategories.push({
      id: Date.now().toString(),
      name: formData.value.name,
      products: [],
    });
    addToastMessage("success", "Sous-Category Added", `Sous-category "${formData.value.name}" added to ${selectedCategory.value.name}.`);
  }

  // Update PanelMenu Data
  transformToPanelMenu();
  dialogVisible.value = false;
};


// Close Dialog
const closeDialog = () => {
  dialogVisible.value = false;
};
</script>




<template>
  <div class="card">
    <!-- Toolbar -->
    <Toolbar class="mb-6">
      <template #start>
        <Button
          label="Add Super Category"
          icon="pi pi-plus"
          severity="secondary"
          class="mr-2"
          @click="openDialog('superCategory')"
        />
        <Button
          label="Add Category"
          icon="pi pi-plus"
          severity="secondary"
          class="mr-2"
          @click="openDialog('category')"
        />
        <Button
          label="Add Sous-Category"
          icon="pi pi-plus"
          severity="secondary"
          class="mr-2"
          @click="openDialog('sousCategory')"
        />
      </template>
    </Toolbar>

    <!-- PanelMenu -->
    <div>
      <PanelMenu :model="categoriesModel" class="w-full" />
    </div>

    <!-- Dialog for Adding Entities -->
    <Dialog v-model:visible="dialogVisible" header="Manage Category" :style="{ width: '400px' }">
      <div v-if="currentContext === 'category' || currentContext === 'sousCategory'">
        <label for="superCategory" class="block font-bold mb-3">Select Super Category</label>
        <Dropdown
          id="superCategory"
          v-model="selectedSuperCategory"
          :options="superCategories"
          optionLabel="name"
          placeholder="Choose Super Category"
        />
      </div>
      <div v-if="currentContext === 'sousCategory'">
        <label for="category" class="block font-bold mb-3 mt-3">Select Category</label>
        <Dropdown
          id="category"
          v-model="selectedCategory"
          :options="selectedSuperCategory?.categories || []"
          optionLabel="name"
          placeholder="Choose Category"
          :disabled="!selectedSuperCategory"
        />
      </div>
      <div>
        <label for="name" class="block font-bold mb-3">Name</label>
        <InputText id="name" v-model="formData.name" />
      </div>
      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="closeDialog" />
        <Button label="Save" icon="pi pi-check" @click="saveEntity" />
      </template>
    </Dialog>
  </div>
</template>



  <script>
export default {
    components: {
      Dialog,
      Button,
      PanelMenu
    },
    setup() {
     
      
  
  

console.log(categories.value);

     
  
      return {
        categories,
        dialogVisible,
        selectedProduct,
        updateProduct,
      };
    },
  };


</script>

  <style>

.p-panelmenu {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

  .card {
    padding: 1rem;
  }
  .field {
    margin-bottom: 1rem;
  }
  </style>
  