<script setup>
import CategorieService from '@/services/categorieService';
import sousCategorieService from '@/services/sousCategorieService';
import superCategorieService from '@/services/superCategorieService';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import PanelMenu from 'primevue/panelmenu';
import Textarea from 'primevue/textarea';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';

// Toast for notifications
const toast = useToast();

// Reactive state for dialogs and data
const dialogVisible = ref(false);
const displayConfirmation = ref(false);
const addProductDialog = ref(false);
const selectedSuperCategory = ref(null);
const selectedCategory = ref(null);
const currentContext = ref(null);
const contexttype = ref(null);
const newProduct = ref({ name: '', price: '', quantity: '' });
const formData = ref({ id: null, name: '',fields:[''] });
const itemtoDelete=ref(null);
const confirmPopup = useConfirm();

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

 function openConfirmation(context,id) {
  currentContext.value = context;
  itemtoDelete.value=id;
    displayConfirmation.value = true;
}
function closeConfirmation() {
    displayConfirmation.value = false;
}
const deleteItem= async ()=>{
  
  if (currentContext.value === 'superCategory') {
  try {
    console.log(itemtoDelete.value);
    const response = await superCategorieService.deleteData(itemtoDelete.value);
    console.log('Super Category Deleted successfully:', response);
    toast.add({
      severity: 'info',
      summary: 'Confirmed',
      detail: 'Super Category deleted successfully!',
      life: 3000,
    });
    fetchSuperCategories();
  } catch (error) {
    if (error.response) {
      const statusCode = error.response.status;
      if (statusCode === 400) {
        toast.add({
          severity: 'error',
          summary: 'Bad Request',
          detail: 'Failed to delete: Operation Cannot Procceed , Hiarchy Is not Valid.',
          life: 3000,
        });
      } else if (statusCode === 404) {
        toast.add({
          severity: 'warn',
          summary: 'Not Found',
          detail: 'Failed to delete: Super Category not found.',
          life: 3000,
        });
      } else {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An unexpected error occurred.',
          life: 3000,
        });
      }
    } else {
      console.error('Failed to Delete Super Category:', error);
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Unable to connect to the server.',
        life: 3000,
      });
    }
  } finally {
    closeConfirmation();
  }
}
else
  if (currentContext.value==='category'){
    try {
    console.log(itemtoDelete.value);
    const response = await CategorieService.deleteData(itemtoDelete.value);
    console.log('Category Deleted successfully:', response);
    toast.add({
      severity: 'info',
      summary: 'Confirmed',
      detail: 'Category deleted successfully!',
      life: 3000,
    });
    fetchSuperCategories();
  } catch (error) {
    if (error.response) {
      const statusCode = error.response.status;
      if (statusCode === 400) {
        toast.add({
          severity: 'error',
          summary: 'Bad Request',
          detail: 'Failed to delete: Operation Cannot Procceed , Hiarchy Is not Valid.',
          life: 3000,
        });
      } else if (statusCode === 404) {
        toast.add({
          severity: 'warn',
          summary: 'Not Found',
          detail: 'Failed to delete: Category not found.',
          life: 3000,
        });
      } else {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An unexpected error occurred.',
          life: 3000,
        });
      }
    } else {
      console.error('Failed to Delete Category:', error);
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Unable to connect to the server.',
        life: 3000,
      });
    }
  } finally {
    closeConfirmation();
  }
  }else
  if (currentContext.value==='sousCategory'){
    try {
    console.log(itemtoDelete.value);
    const response = await sousCategorieService.deleteData(itemtoDelete.value);
    console.log('Sous Category Deleted successfully:', response);
    toast.add({
      severity: 'info',
      summary: 'Confirmed',
      detail: 'Sous Category deleted successfully!',
      life: 3000,
    });
    fetchSuperCategories();
  } catch (error) {
    if (error.response) {
      const statusCode = error.response.status;
      if (statusCode === 400) {
        toast.add({
          severity: 'error',
          summary: 'Bad Request',
          detail: 'Failed to delete: Operation Cannot Procceed , Hiarchy Is not Valid.',
          life: 3000,
        });
      } else if (statusCode === 404) {
        toast.add({
          severity: 'warn',
          summary: 'Not Found',
          detail: 'Failed to delete: Sous Category not found.',
          life: 3000,
        });
      } else {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An unexpected error occurred.',
          life: 3000,
        });
      }
    } else {
      console.error('Failed to Delete Sous Category:', error);
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Unable to connect to the server.',
        life: 3000,
      });
    }
  } finally {
    closeConfirmation();
  }
  }
}
 
const transformToPanelMenu = () => {
      categoriesModel.value = superCategories.value.map((superCategory) => ({
        label: superCategory.name,
        props: {
            hasButton: true,
            buttonProps: {
               icon: 'pi pi-file',
              severity: 'info',
              class: 'mr-3',
              onClick: () => openDialog("superCategory","updateSuperCategory",superCategory),
            },
            hasSecondButton:true,
            buttonSecondProps: {
               icon: 'pi pi-plus',
              severity: 'success',
              class: 'mr-3',
              onClick: () => openDialog("category","addToSuperCategory",superCategory),
            },
            hasDeleteButton:true,
            buttonDeleteProps: {
               icon: 'pi pi-trash',
              severity: 'danger',
              class: 'mr-3',
              onClick: () => openConfirmation("superCategory",superCategory.id),
            },
          },
        items: superCategory.categories.map((category) => ({
          label: category.name,
          props:  {
            hasButton: true,
            buttonProps: {
               icon: 'pi pi-file',
              severity: 'info',
              class: 'mr-3',
              onClick: () => openDialog("category","updateCategory",superCategory,category),
            },
            hasSecondButton:true,
            buttonSecondProps: {
               icon: 'pi pi-plus',
              severity: 'help',
              class: 'mr-3',
              onClick: () => openDialog("sousCategory","addToCategory",superCategory,category),
            },
            hasDeleteButton:true,
            buttonDeleteProps: {
               icon: 'pi pi-trash',
              severity: 'danger',
              class: 'mr-3',
              onClick: () => openConfirmation("category",category.id),
            },
          },
          items: category.sousCategories.map((sousCategory) => ({
            label: sousCategory.name,
            props: {
            hasButton: true,
            buttonProps: {
               icon: 'pi pi-file',
              severity: 'info',
              class: 'mr-2',
              onClick: () => openDialog("sousCategory","updateSousCategory",superCategory,category,sousCategory),
            },
            // !important,  adding a product will prove dificult with how long it will take ,
            // hasSecondButton:true,
            // buttonSecondProps: {
            //    icon: 'pi pi-plus',
            //   severity: 'secondary',
            //   class: 'mr-2',
            //   onClick: () => openDialog("sousCategory",sousCategory),
            // },
            hasDeleteButton:true,
            buttonDeleteProps: {
               icon: 'pi pi-trash',
              severity: 'danger',
              class: 'mr-3',
              onClick: () => openConfirmation("sousCategory",sousCategory.id),
            },
          },
          })),
        })),
      }));
    };

// Open Dialog for Adding Entities
const openDialog = (context,type, superCategorie,categorie,sousCategorie) => {
    currentContext.value = context; // Context: 'superCategory', 'category', 'sousCategory'
    contexttype.value=type
    formData.value = { id: null, name: '', description: '',fields:[] }; // Default form data

    
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
        formData.value.superCategorie= superCategorie ;
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
  formData.value = { id: null, name: '', description: '',fields:[''],
  categorie: categorie || null,
   }; // Default form data
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
const saveEntity = async () => {
    if (currentContext.value === 'superCategory') {
       if (contexttype.value==='new')
       {
           try {
        const response = await superCategorieService.postData(formData.value);
        console.log('Super Category created successfully:', response);
        toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Operation Successfull : Super Category Created', life: 3000 });

       } catch (error) {
        console.error('Failed to create Super Category:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to Create Super Category.',
            life: 3000
        });
       }
       }
       if (contexttype.value==='updateSuperCategory'){
             try {
        const response = await superCategorieService.updateData(formData.value,formData.value.id);
        toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Operation Successfull : Super Category Updated', life: 3000 });
        console.log(' super Category updated successfully:', response);
       } catch (error) {
        console.error('Failed to create Super Category:', error);
        toast.add({severity: 'error', summary: 'Error', detail: 'Failed to Update Super Category.', life: 3000});
       }

       }
    } else if (currentContext.value === 'category') {
         if (contexttype.value==='new')
       {
         formData.value.superCategorie=selectedSuperCategory;
         try {
        const response = await CategorieService.postData(formData.value);
        console.log('  Category created successfully:', response);
        toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Operation Successfull : Category Created', life: 3000 });

       } catch (error) {
        console.error('Failed to create  Category:', error);
        toast.add({severity: 'error', summary: 'Error', detail: 'Failed to Create Category.', life: 3000});
       }
       }
       if (contexttype.value==='addToSuperCategory'){
        try {
        const response = await CategorieService.postData(formData.value);
        console.log('  Category created successfully:', response);
        toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Operation Successfull : Category Created', life: 3000 });
       } catch (error) {
        console.error('Failed to create Super Category:', error);
        toast.add({severity: 'error', summary: 'Error', detail: 'Failed to Create Category.', life: 3000});
       }
       }
       if (contexttype.value==='updateCategory')
       {  
        try {
        const response = await CategorieService.updateData(formData.value,formData.value.id);
        console.log('  Category created successfully:', response);
        toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Operation Successfull : Category Updated', life: 3000 });
       } catch (error) {
        console.error('Failed to create Super Category:', error);
        toast.add({severity: 'error', summary: 'Error', detail: 'Failed to Update Category.', life: 3000});
       }
       }
       
    } else if (currentContext.value === 'sousCategory') {
      if (contexttype.value==='new')
       {
      // create sous category from scratch
       formData.value.categorie=selectedCategory;
         try {
        const response = await sousCategorieService.postData(formData.value);
        console.log('  Category created successfully:', response);
        toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Operation Successfull : Sous Category Created', life: 3000 });
       } catch (error) {
        console.error('Failed to create Super Category:', error);
        toast.add({severity: 'error', summary: 'Error', detail: 'Failed to Create Sous Category.', life: 3000});
       }
       }
       if (contexttype.value==='addToCategory'){
        try {
          console.log(formData.value)
        const response = await sousCategorieService.postData(formData.value);
        console.log('  Category created successfully:', response);
        toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Operation Successfull : Sous Category Created', life: 3000 });
       } catch (error) {
        console.error('Failed to create Super Category:', error);
        toast.add({severity: 'error', summary: 'Error', detail: 'Failed to Create Sous Category.', life: 3000});
       }
       }
       if (contexttype.value  ==='updateSousCategory'){
        try {
        const response = await sousCategorieService.updateData(formData.value,formData.value.id);
        console.log('  Category created successfully:', response);
        toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Operation Successfull : Sous Category Updated', life: 3000 });

       } catch (error) {
        console.error('Failed to create Super Category:', error);
        toast.add({severity: 'error', summary: 'Error', detail: 'Failed to Update Sous Category.', life: 3000});
       }
       }
    }

    fetchSuperCategories();
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
        <div class="flex items-center justify-between p-3">
          <!-- Arrow Icon with Label (left) -->
          <Button
            class="p-button-text p-button-sm mr-2 "
            :label="slotProps.item.label"
            :icon="slotProps.active ? 'pi pi-chevron-down' : 'pi pi-chevron-right'"
            :style="{ fontSize: '16px' }" 
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
            <template v-if="slotProps.item.props?.hasDeleteButton">
               <Button
              v-bind="slotProps.item.props.buttonDeleteProps"
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

    <div v-if="(currentContext === 'sousCategory' || currentContext === 'category') && contexttype!=='new' && contexttype!=='updateSuperCategory'  ">
      <label for="supers" class="block font-bold mb-3">Super Category</label>
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
  <Dialog header="Confirmation" v-model:visible="displayConfirmation" :style="{ width: '350px' }" :modal="true">
                    <div class="flex items-center justify-center">
                        <i class="pi pi-exclamation-triangle mr-4" style="font-size: 2rem" />
                        <span>Are you sure you want to proceed?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" @click="closeConfirmation" text severity="secondary" />
                        <Button label="Yes" icon="pi pi-check" @click="deleteItem" severity="danger" outlined autofocus />
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
