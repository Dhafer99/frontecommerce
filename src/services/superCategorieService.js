import api from "./api";

 
// Example Service
const  superCategorieService = {
  // GET request
  getSuperCategorie() {
    return api.get("/superCategories");
  },

  getHiarchy(){
    return api.get("/superCategories/hiarchy")
  },

  // POST request
  postData(data) {
    return api.post("/superCategories", data);
  },

  // PUT request
  updateData(data,id) {
    return api.put(`/superCategories/${id}`, data);
  },


  // DELETE request
  deleteData(id) {
    return api.delete(`/superCategories/${id}`);
  },
};

export default superCategorieService;
