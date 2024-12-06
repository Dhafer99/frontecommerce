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
  deleteData(path) {
    return api.delete(path);
  },
};

export default productService;
