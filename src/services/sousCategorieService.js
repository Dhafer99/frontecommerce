import api from "./api";

 
// Example Service
const  sousCategorieService = {
  // GET request
  getSousCategorie() {
    return api.get("/sousCategories");
  },

  // POST request
  postData(data) {
    return api.post("/sousCategories", data);
  },

  // PUT request
  updateData(data,id) {
    return api.put(`/sousCategories/${id}`, data);
  },

  // DELETE request
  deleteData(id) {
    return api.delete(`/sousCategories/${id}`);
  },
};

export default sousCategorieService;
