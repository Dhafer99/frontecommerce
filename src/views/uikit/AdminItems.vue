<script setup>
import superCategorieService from '@/services/superCategorieService';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import PanelMenu from 'primevue/panelmenu';
import Textarea from 'primevue/textarea';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';

// Toast for notifications
const toast = useToast();

// Reactive state for dialogs and data
const dialogVisible = ref(false);
const addProductDialog = ref(false);
const selectedSuperCategory = ref(null);
const selectedCategory = ref(null);
const currentContext = ref(null);
const contexttype = ref(null);
const newProduct = ref({ name: '', price: '', quantity: '' });
const formData = ref({ id: null, name: '',fields:[''] });
// Super Categories Data (initially empty)
const superCategories = ref([]);
 
function addField() {
        formData.value.fields.push(''); // Add a new empty string to the array
    };
function removeField(index) {
       formData.value.fields.splice(index, 1); // Remove the field at the specified index
    };

// Fetch Super Categories Hierarchy
const fetchSuperCategories = async () => {
    try {
        const response = await superCategorieService.getHiarchy();
        superCategories.value = response.data; // Assuming the API response contains the hierarchy
        transformToPanelMenu();
    } catch (error) {
        console.error('Error fetching super categories hierarchy:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to fetch super categories.',
            life: 3000
        });
    }
};
// PanelMenu Data
const categoriesModel = ref([]);

// Fetch data on component mount
onMounted(() => {
    fetchSuperCategories();
});
const dialogHeader = computed(() => {
      if (currentContext.value === "superCategory"  ) return "Manage Super Category";
      if (currentContext.value === "category"  ) return "Manage Category";
      if (currentContext.value === "sousCategory"  ) return "Manage Sous Category";
      return "Manage Entity";
    });

const transformToPanelMenu = () => {
      categoriesModel.value = superCategories.value.map((superCategory) => ({
        label: superCategory.name,
        props: {
            hasButton: true,
            buttonProps: {
               icon: 'pi pi-file',
              severity: 'secondary',
              class: 'mr-3',
              onClick: () => openDialog("superCategory","updateSuperCategory",superCategory),
            },
            hasSecondButton:true,
            buttonSecondProps: {
               icon: 'pi pi-plus',
              severity: 'secondary',
              class: 'mr-3',
              onClick: () => openDialog("category","addToSuperCategory",superCategory),
            },
          },
        items: superCategory.categories.map((category) => ({
          label: category.name,
          props:  {
            hasButton: true,
            buttonProps: {
               icon: 'pi pi-file',
              severity: 'secondary',
              class: 'mr-3',
              onClick: () => openDialog("category","updateCategory",superCategory,category),
            },
            hasSecondButton:true,
            buttonSecondProps: {
               icon: 'pi pi-plus',
              severity: 'secondary',
              class: 'mr-3',
              onClick: () => openDialog("sousCategory","addToCategory",superCategory,category),
            },
          },
          items: category.sousCategories.map((sousCategory) => ({
            label: sousCategory.name,
            props: {
            hasButton: true,
            buttonProps: {
               icon: 'pi pi-file',
              severity: 'secondary',
              class: 'mr-2',
              onClick: () => openDialog("sousCategory","updateSousCategory",superCategory,category,sousCategory),
            },
            // hasSecondButton:true,
            // buttonSecondProps: {
            //    icon: 'pi pi-plus',
            //   severity: 'secondary',
            //   class: 'mr-2',
            //   onClick: () => openDialog("sousCategory",sousCategory),
            // },
          },
          })),
        })),
      }));
    };

// Open Dialog for Adding Entities
const openDialog = (context,type, superCategorie,categorie,sousCategorie) => {
    currentContext.value = context; // Context: 'superCategory', 'category', 'sousCategory'
    contexttype.value=type
    formData.value = { id: null, name: '', description: '' }; // Default form data

    
    // Modify formData and set dropdown initial values based on context
    if (context === 'superCategory'   ) {
      if (type ==='updateSuperCategory'){
        formData.value = {
            id: superCategorie?.id || null,
            name: superCategorie?.name || '',
            description: superCategorie?.description || '',
        };
      }

    } else if (context === 'category') {
      if (type==="addToSuperCategory"){
        console.log(superCategorie)
        selectedSuperCategory.value = superCategorie?.name
      }
      if (type==='updateCategory')
      {     
     formData.value = {
            id: categorie?.id || null,
            name: categorie?.name || '',
            superCategorie: superCategorie || null,
            description: categorie?.description || '',
        };
        selectedSuperCategory.value = superCategorie?.name
    }
    

    } else if (context === 'sousCategory') {
      if ( type ==='updateSousCategory'){
        formData.value = {
            id: sousCategorie?.id || null,
            name: sousCategorie?.name || '',
            categorie: sousCategorie?.categorie || null,
            description: sousCategorie?.description || '',
            fields: sousCategorie?.fields || [''],
        };
        selectedSuperCategory.value = superCategorie?.name
        selectedCategory.value=categorie?.name
      }
        
        if (type==='addToCategory')
{
  formData.value = { id: null, name: '', description: '',fields:[''] }; // Default form data
   selectedCategory.value=superCategorie?.name
   selectedSuperCategory.value = categorie?.name

}

     }

    // Show dialog
    dialogVisible.value = true;
};



// Save Entity (Super Category, Category, Sous-Category) ( DHAFER WORK TO DO , //
// paladin  !important NOTE please READ
// use the currentContext  to pick a super categorie or category or sous categorie , 
//   most variables are already placed correctly inside formData ,  ( try to console log the push to check for misshaps ( NO CHATGPT ))
//)
// contexttype values that might prove usefull  in understanding what is happening
//  
// {
// updateSuperCategory                        update selected super category
// addToSuperCategory                       we add a category to a selected super category
// updateCategory                               update selected category
// addToCategory                           we add a sous category to a selected category
// updateSousCategory                        update souscategory

// // addproduct

// }
const saveEntity = () => {
    if (currentContext.value === 'superCategory') {
        superCategories.value.push({
            id: Date.now().toString(),
            name: formData.value.name,
            categories: []
        });
        toast.add({
            severity: 'success',
            summary: 'Super Category Added',
            detail: `Super category "${formData.value.name}" added.`
        });
    } else if (currentContext.value === 'category') {
        if (!selectedSuperCategory.value) {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please select a Super Category.'
            });
            return;
        }
        selectedSuperCategory.value.categories.push({
            id: Date.now().toString(),
            name: formData.value.name,
            sousCategories: []
        });
        toast.add({
            severity: 'success',
            summary: 'Category Added',
            detail: `Category "${formData.value.name}" added to ${selectedSuperCategory.value.name}.`
        });
    } else if (currentContext.value === 'sousCategory') {
        if (!selectedSuperCategory.value || !selectedCategory.value) {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please select a Super Category and Category.'
            });
            return;
        }
        selectedCategory.value.sousCategories.push({
            id: Date.now().toString(),
            name: formData.value.name,
            products: []
        });
        toast.add({
            severity: 'success',
            summary: 'Sous-Category Added',
            detail: `Sous-category "${formData.value.name}" added to ${selectedCategory.value.name}.`
        });
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
                <Button label="Add Super Category" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openDialog('superCategory','new',null)" />
                <Button label="Add Category" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openDialog('category','new', null)" />
                <Button label="Add Sous-Category" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openDialog('sousCategory','new', null)" />
            </template>
        </Toolbar>

        <!-- PanelMenu -->
        <div>
     
          <PanelMenu :model="categoriesModel" class="w-full">
      <!-- Custom item rendering -->
      <template #item="slotProps">
        <div class="flex items-center justify-between pd-10">
          <!-- Arrow Icon with Label (left) -->
          <Button
            class="p-button-text p-button-sm mr-2"
            :label="slotProps.item.label"
            :icon="slotProps.active ? 'pi pi-chevron-down' : 'pi pi-chevron-right'"
            @click="slotProps.toggle"
          />

          <!-- Custom buttons (optional, on the right) -->
          <div class="flex items-center ml-auto">
            <template v-if="slotProps.item.props?.hasButton">
              <Button
                v-bind="slotProps.item.props.buttonProps"
                class="mr-2"
              />
            </template>
            <template v-if="slotProps.item.props?.hasSecondButton">
              <Button
                v-bind="slotProps.item.props.buttonSecondProps"
                class="mr-2"
              />
            </template>
          </div>
        </div>
      </template>
    </PanelMenu>
        </div>

        <!-- Dialog for Adding Entities -->
        <Dialog
    v-model:visible="dialogVisible"
    :header="dialogHeader"
    :style="{ width: '400px' }"
  >
    <!-- Super Category Dropdown -->
    <div v-if="(currentContext === 'category' || currentContext === 'sousCategory') && contexttype === 'new'">
      <label class="block font-bold mb-3">Super Category</label>
      <Dropdown
        v-model="selectedSuperCategory"
        :options="superCategories"
        optionLabel="name"
        placeholder='Choose Super Category'
        />
    </div>

    <!-- Category Dropdown -->
    <div v-if="currentContext === 'sousCategory' && contexttype==='new' &&  contexttype!=='addToSuperCategory'">
      <label class="block font-bold mb-3 mt-3">Category</label>
      <Dropdown
        v-model="selectedCategory"
        :options="selectedSuperCategory?.categories || []"
        optionLabel="name"
        placeholder="Choose Category"
        />
    </div>

    <div v-if="currentContext === 'sousCategory' || currentContext === 'category' && contexttype!=='new' && contexttype!=='updateSuperCategory'  ">
      <label for="supers" class="block font-bold mb-3">Super Categoryeee</label>
      <InputText id="supers" :value=selectedSuperCategory  :placeholder=selectedSuperCategory disabled="true" />
    </div>
    <div v-if="currentContext === 'category' && contexttype!=='new' && contexttype!=='updateCategory' &&  contexttype!=='addToSuperCategory'"  >
      <label for="super" class="block font-bold mb-3">Category</label>
      <InputText id="super" :value=selectedSuperCategory  :placeholder=selectedSuperCategory disabled="true" />
    </div>
    <div v-if="currentContext === 'sousCategory' && contexttype!=='new'">
      <label for="categorys" class="block font-bold mb-3">Category</label>
      <InputText id="categorys" :value=selectedCategory  :placeholder=selectedCategory disabled="true" />
    </div>
    <!-- Name Input -->
    <div>
      <label for="name" class="block font-bold mb-3">Name</label>
      <InputText id="name" v-model="formData.name" placeholder="Enter name" />
    </div>

    <!-- Description Input -->
    <div>
      <label for="description" class="block font-bold mb-3">Description</label>
      <Textarea
        id="description"
        v-model="formData.description"
        placeholder="Enter description"
      />
    </div>

    <!-- Dynamic Mandatory Fields -->
    <div v-if="currentContext === 'sousCategory'">
    <label for="fields" class="block font-bold mb-3 mt-3">Add Mandatory Fields</label>
    <div
      v-for="(field, index) in formData.fields"
      :key="index"
      class="mb-3 flex items-center space-x-3"
    >
      <label :for="'field-' + index" class="block font-medium">Field {{ index + 1 }}</label>
      <input
        :id="'field-' + index"
        type="text"
        v-model="formData.fields[index]"
        class="border rounded px-2 py-1 flex-1"
        placeholder="Enter field name"
      />
      <button
        type="button"
        class="bg-red-500 text-white px-2 py-1 rounded"
        @click="removeField(index)"
      >
        Remove
      </button>
    </div>
    <button
      type="button"
      class="bg-blue-500 text-white px-4 py-2 rounded"
      @click="addField"
    >
      Add Field
    </button>
  </div>

    <!-- Dialog Footer -->
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
            updateProduct
        };
    }
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
