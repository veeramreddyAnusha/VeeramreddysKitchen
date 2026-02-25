package com.veeramreddy.veeramreddys_kitchen.Service;

import java.io.IOException;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.veeramreddy.veeramreddys_kitchen.Dao.FoodItemDao;
import com.veeramreddy.veeramreddys_kitchen.Dto.Category;
import com.veeramreddy.veeramreddys_kitchen.Dto.FoodItem;
import com.veeramreddy.veeramreddys_kitchen.Exception.NoSuchElementFoundException;
import com.veeramreddy.veeramreddys_kitchen.Repo.CategoryRepo;
import com.veeramreddy.veeramreddys_kitchen.Util.ResponseStructure;

@Service
public class FoodItemService {
    
    @Autowired
    private FoodItemDao dao;
    
    @Autowired
    private CategoryRepo categoryRepo;

    public ResponseEntity<ResponseStructure<FoodItem>> saveFoodItem(FoodItem fooditem){

        FoodItem savedFood = dao.saveFoodItem(fooditem);

        ResponseStructure<FoodItem> structure = new ResponseStructure<>();
        structure.setStatus(HttpStatus.CREATED.value());
        structure.setData(savedFood);
        structure.setMessage("Food Item saved successfully ");

        return new ResponseEntity<ResponseStructure<FoodItem>>(structure, HttpStatus.CREATED);
    }
   
//  -----------------------------------------------------------------------------------------------

	public ResponseEntity<ResponseStructure<FoodItem>> DeleteFoodItem(long foodId) {
		 FoodItem db = dao.DeleteFoodItem(foodId);

	        if (db != null) {
	            ResponseStructure<FoodItem> structure = new ResponseStructure<>();
	            structure.setMessage("Deleted successfully");
	            structure.setStatus(HttpStatus.OK.value());
	            structure.setData(db);
	            return new ResponseEntity<>(structure, HttpStatus.OK);
	        } else {
	            throw new NoSuchElementFoundException("FoodItem ID not found in the database.");
	        }
	}
	
//  -----------------------------------------------------------------------------------------------

	public ResponseEntity<ResponseStructure<FoodItem>> getFoodItemById(long foodId) {
	    FoodItem fooditem = dao.getFoodItemById(foodId);
	    ResponseStructure<FoodItem> structure = new ResponseStructure<>();

	    if(fooditem != null) {
	        structure.setData(fooditem);
	        structure.setStatus(HttpStatus.OK.value());
	        structure.setMessage("FoodItem found");

	        return new ResponseEntity<>(structure, HttpStatus.OK);
	    }
	    else {
	        throw new NoSuchElementFoundException("No FoodItem found for id " + foodId);
	    }
	}

	
//  -----------------------------------------------------------------------------------------------
	
	public ResponseEntity<ResponseStructure<FoodItem>> updateFoodItemWithImage(
	        Long foodId,
	        String name,
	        Double price,
	        String quantity,
	        Long categoryId,
	        MultipartFile image
	) {

	    ResponseStructure<FoodItem> structure = new ResponseStructure<>();

	    FoodItem existing = dao.getFoodItemById(foodId);

	    if (existing == null) {
	        throw new NoSuchElementFoundException(
	                "FoodItem not found on id " + foodId
	        );
	    }

	   
	    existing.setName(name);
	    existing.setPrice(price);
	    existing.setQuantity(quantity);

	   
	    if (categoryId != null) {
	        Category category = categoryRepo.findById(categoryId)
	                .orElseThrow(() -> new RuntimeException("Category not found"));
	        existing.setCategory(category);
	    }

	  
	    if (image != null && !image.isEmpty()) {
	        try {
	            existing.setImage(image.getBytes());
	        } catch (IOException e) {
	            throw new RuntimeException("Failed to update image", e);
	        }
	    }

	    FoodItem updated = dao.UpdateFoodItem(existing);

	    structure.setData(updated);
	    structure.setMessage("FoodItem updated successfully");
	    structure.setStatus(HttpStatus.OK.value());

	    return new ResponseEntity<>(structure, HttpStatus.OK);
	}

	
	
	
	
//	-------------------------------------------------------------------------------------------------------

	public ResponseEntity<ResponseStructure<List<FoodItem>>> getAllFoodItems() {
ResponseStructure<List<FoodItem>> structure=new ResponseStructure<List<FoodItem>>();
		
		List<FoodItem> FI=dao.getAllFoodItems();
		if(FI !=null) {
			structure.setData(dao.getAllFoodItems());
			structure.setStatus(HttpStatus.FOUND.value());
			structure.setMessage("All users are getting");
			
			
			return new ResponseEntity<ResponseStructure<List<FoodItem>>>(structure,HttpStatus.FOUND);
		}
		else throw new NoSuchElementFoundException("No data is there in the database");
		
	}
	
	
	// -------------------------------------------------------------------------------------------------------

	public ResponseEntity<ResponseStructure<List<FoodItem>>> 
	getFoodItemsByCategory(long categoryId) {

	    List<FoodItem> items = dao.getFoodItemsByCategoryId(categoryId);

	    if (items != null && !items.isEmpty()) {
	        ResponseStructure<List<FoodItem>> structure = new ResponseStructure<>();
	        structure.setStatus(HttpStatus.OK.value());
	        structure.setMessage("Food items fetched by category");
	        structure.setData(items);

	        return new ResponseEntity<>(structure, HttpStatus.OK);
	    } else {
	        throw new NoSuchElementFoundException(
	            "No food items found for category id " + categoryId
	        );
	    }
	}


}
