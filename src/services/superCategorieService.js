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
  postData( data) {
    return api.post("/superCategories", data);
  },

  // PUT request
  updateData(path, data) {
    return api.put(path, data);
  },

  // DELETE request
  deleteData(path) {
    return api.delete(path);
  },
};

export default superCategorieService;
