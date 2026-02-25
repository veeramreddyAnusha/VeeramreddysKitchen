package com.veeramreddy.veeramreddys_kitchen.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.veeramreddy.veeramreddys_kitchen.Dao.CategoryDao;
import com.veeramreddy.veeramreddys_kitchen.Dao.FoodItemDao;
import com.veeramreddy.veeramreddys_kitchen.Dto.Admin;
import com.veeramreddy.veeramreddys_kitchen.Dto.Category;
import com.veeramreddy.veeramreddys_kitchen.Exception.NoSuchElementFoundException;
import com.veeramreddy.veeramreddys_kitchen.Util.ResponseStructure;

@Service
public class CategoryService {
	
	@Autowired
	private CategoryDao dao;
	
	@Autowired
	private FoodItemDao foodItemDao;
	
	public ResponseEntity<ResponseStructure<Category>> saveCategory(Category category){
		Category saveCategory =dao.saveCategory(category);
		ResponseStructure<Category> structure=new ResponseStructure<Category>();
		structure.setStatus(HttpStatus.CREATED.value());
		structure.setData(saveCategory);
		structure.setMessage("Category saved successfully");
		
		return new ResponseEntity<ResponseStructure<Category>>(structure,HttpStatus.CREATED);
		
	}
	
//	------------------------------------------------------------------------------------------------

	public ResponseEntity<ResponseStructure<Category>> getcategoryById(long categoryId){
		Category category= dao.getCategoryById(categoryId);
		ResponseStructure<Category> structure=new ResponseStructure<Category>();
		if(category!=null) {
		structure.setStatus(HttpStatus.FOUND.value());
		structure.setData(category);
		structure.setMessage("category found By Id succesfully");
		
		return new ResponseEntity<ResponseStructure<Category>>(structure,HttpStatus.FOUND);
		}
		else {
			throw new NoSuchElementFoundException("no User found for the particular id " +categoryId);
		}
		
	}
	
	
//	-----------------------------------------------------------------------------------------------------------

	  public ResponseEntity<ResponseStructure<Category>> categoryUpdate(Category category) {

	        ResponseStructure<Category> structure = new ResponseStructure<>();

	        Category existing = dao.getCategoryById(category.getCategoryId());

	        if (existing == null) {
	            structure.setMessage("Category not found");
	            structure.setStatus(HttpStatus.NOT_FOUND.value());
	            structure.setData(null);
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(structure);
	        }

	        existing.setCategoryName(category.getCategoryName());

	        Category updated = dao.updateCategory(existing);

	        structure.setMessage("Category updated successfully");
	        structure.setStatus(HttpStatus.OK.value());
	        structure.setData(updated);

	        return ResponseEntity.ok(structure);
	    }
	
//	----------------------------------------------------------------------------------------------------------------------------
			
	  @Transactional
	  public ResponseEntity<ResponseStructure<String>> deleteCategory(long categoryId) {

	      ResponseStructure<String> structure = new ResponseStructure<>();

	      Category category = dao.getCategoryById(categoryId);

	      if (category == null) {
	          throw new NoSuchElementFoundException(
	                  "Category ID not found: " + categoryId);
	      }

	      foodItemDao.detachCategory(categoryId);
	      dao.deleteCategory(categoryId);

	      structure.setMessage("Category deleted successfully");
	      structure.setStatus(HttpStatus.OK.value());
	      structure.setData(null);

	      return new ResponseEntity<>(structure, HttpStatus.OK);
	  }

	  
	  
	  
	  
//	----------------------------------------------------------------------------------------------------
	
	public ResponseEntity<ResponseStructure<Category>> getcategoryByName(String categoryName){
		Category category= dao.getCategoryByName(categoryName);
		ResponseStructure<Category> structure=new ResponseStructure<Category>();
		if(category!=null) {
		structure.setStatus(HttpStatus.FOUND.value());
		structure.setData(category);
		structure.setMessage("category found By name succesfully");
		
		return new ResponseEntity<ResponseStructure<Category>>(structure,HttpStatus.FOUND);
		}
		else {
			throw new NoSuchElementFoundException("no User found for the particular name " +categoryName);
		}
		
	}
	
	
//	-----------------------------------------------------------------------------------------------------------

	
	public ResponseEntity<ResponseStructure<List<Category>>> getAllCategorys() {
		  ResponseStructure<List<Category>> structure=new ResponseStructure<List<Category>>();
				
		  List<Category> category=dao.getAllCategorys();
			if(category !=null) {
				structure.setData(dao.getAllCategorys());
				structure.setStatus(HttpStatus.FOUND.value());
				structure.setMessage("All Categoryies are getting");
					return new ResponseEntity<ResponseStructure<List<Category>>>(structure,HttpStatus.FOUND);
				}
				else throw new NoSuchElementFoundException("No data is there in the database");
			}
			

//			--------------------------------------------------------------------------------------------------
			

}
