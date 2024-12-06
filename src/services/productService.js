import api from "./api";

 
// Example Service
export const  productService = {

  
  // GET request
  getProducts() {


    return api.get("/products");
  },

  // POST request
  postData(data) {
    return api.post('/products', data);
  },

  // PUT request
  updateData(data, id) {
    return api.put(`/products/${id}`, data);
  },

  // DELETE request
  deleteProduct(id) {
    return api.delete(`/products/${id}`);
  },
  deleteMultipleProducts(ids) {
    return api.delete('/products/delete-multiple', {
      data: ids, // Pass the list of IDs in the request body
    });
  },
};
export default productService;
