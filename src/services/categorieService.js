import api from "./api";

 
// Example Service
const  CategorieService = {
  // GET request
  getCategorie() {
    return api.get("/Categories");
  },

  // POST request
  postData(data) {
    return api.post("/Categories", data);
  },

  // PUT request
  updateData(data,id) {
    return api.put(`/Categories/${id}`, data);
  },

  // DELETE request
  deleteData(id) {
    return api.delete(`/Categories/${id}`);
  },
};

export default CategorieService;
