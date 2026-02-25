package com.veeramreddy.veeramreddys_kitchen.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.veeramreddy.veeramreddys_kitchen.Dto.Admin;
import com.veeramreddy.veeramreddys_kitchen.Dto.App_User;
import com.veeramreddy.veeramreddys_kitchen.Dto.Category;
import com.veeramreddy.veeramreddys_kitchen.Service.CategoryService;
import com.veeramreddy.veeramreddys_kitchen.Util.ResponseStructure;

@Controller
@CrossOrigin(origins = "*", methods = {RequestMethod.POST,RequestMethod.GET,RequestMethod.DELETE,RequestMethod.PUT})
public class CategoryController {
	
	@Autowired
	private CategoryService service;
	
	@PostMapping("/SaveCategory")
	public ResponseEntity<ResponseStructure<Category>> saveCategory(@RequestBody Category category){
		return service.saveCategory(category);
		
	}
	

//	------------------------------------------------------------------------------------------------------------------------
	
	@GetMapping("/FindCategoryById")
	public ResponseEntity<ResponseStructure<Category>> getCategoryById(@RequestParam long categoryId){
		return service.getcategoryById(categoryId);
		
	}
	
//	-----------------------------------------------------------------------------------------------------------
	
	@GetMapping("/FindCategoryByName")
	public ResponseEntity<ResponseStructure<Category>> getCategoryByname(@RequestParam String categoryName){
		return service.getcategoryByName(categoryName);
		
	}
	
//	-----------------------------------------------------------------------------------------------------------
    @PutMapping("/CategoryUpdate")
	
	public ResponseEntity<ResponseStructure<Category>> categoryUpdate(@RequestBody Category category){
		return service.categoryUpdate(category);
		
	}

//	----------------------------------------------------------------------------------------------------------
    
    @DeleteMapping("/deleteCategory")
    public ResponseEntity<ResponseStructure<String>> deleteCategory( @RequestParam long categoryId) {
        return service.deleteCategory(categoryId);
    }

	
	
//	--------------------------------------------------------------------------------------------
	
    @GetMapping("/FindAllCategoryies")
	public ResponseEntity<ResponseStructure<List<Category>>> getAllCategorys(){
		return service.getAllCategorys() ;
		
	}
	
//	--------------------------------------------------------------------------------------------------
	
    
}
