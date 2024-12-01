import api from "./api";

 
// Example Service
const  CategorieService = {
  // GET request
  getCategorie() {
    return api.get("/Categories");
  },

  // POST request
  postData( data) {
    return api.post("/Categories", data);
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

export default CategorieService;
