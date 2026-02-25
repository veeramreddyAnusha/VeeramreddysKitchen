package com.veeramreddy.veeramreddys_kitchen.Controller;



import java.io.IOException;
import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.veeramreddy.veeramreddys_kitchen.Dto.Admin;
import com.veeramreddy.veeramreddys_kitchen.Dto.Category;
import com.veeramreddy.veeramreddys_kitchen.Dto.FoodItem;
import com.veeramreddy.veeramreddys_kitchen.Repo.AdminRepo;
import com.veeramreddy.veeramreddys_kitchen.Repo.CategoryRepo;
import com.veeramreddy.veeramreddys_kitchen.Repo.FoodItemRepo;
import com.veeramreddy.veeramreddys_kitchen.Service.FoodItemService;
import com.veeramreddy.veeramreddys_kitchen.Util.ResponseStructure;

@RestController
@CrossOrigin(origins = "*", methods = {RequestMethod.POST,RequestMethod.GET,RequestMethod.DELETE,RequestMethod.PUT})

public class FoodItemController {


    @Autowired
    private FoodItemService service;
    
    @Autowired
    private FoodItemRepo repo;
    
    @Autowired 
   private AdminRepo  adminRepo;
    
    @Autowired
    private CategoryRepo categoryRepo;
    
    
    @PostMapping(value = "/saveFoodItem", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> addFoodItem(
            @RequestParam String name,
            @RequestParam String quantity,
            @RequestParam Double price,
            @RequestParam Long categoryId,
            @RequestParam Long adminId,
            @RequestParam MultipartFile image
    ) throws IOException {

        Admin admin = adminRepo.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        Category category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        FoodItem food = new FoodItem();
        food.setName(name);
        food.setQuantity(quantity);
        food.setPrice(price);
        food.setImage(image.getBytes());
        food.setAdmin(admin);
        food.setCategory(category);

       repo.save(food);

        return ResponseEntity.ok("Food item added successfully");
    }



// ---------------------------------------------------------------------------------------------
    @DeleteMapping("/deleteFoodItem")
	public ResponseEntity<ResponseStructure<FoodItem>> DeleteFoodItem(@RequestParam long foodId){
		return service.DeleteFoodItem(foodId);
		
	}
    
//   -------------------------------------------------------------------------------------------
    
    @GetMapping("/FindFoodItemById")
	public ResponseEntity<ResponseStructure<FoodItem>> getFoodItemById(@RequestParam long foodId){
		return service.getFoodItemById(foodId);
		
	}
    
    
//    ---------------------------------------------------------------------------------------------
    
    @PutMapping(value = "/FoodItemUpdate", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseStructure<FoodItem>> updateFoodItemWithImage(
            @RequestParam Long foodId,
            @RequestParam String name,
            @RequestParam Double price,
            @RequestParam String quantity,
            @RequestParam Long categoryId,
            @RequestParam(required = false) MultipartFile image
    ) {
        return service.updateFoodItemWithImage(
                foodId,
                name,
                price,
                quantity,
                categoryId,
                image
        );
    }

    
     
//     ---------------------------------------------------------------------------------------------------
     @GetMapping("/FindAllFooditems")
 	public ResponseEntity<ResponseStructure<List<FoodItem>>> getAllFoodItems(){
 		return service.getAllFoodItems() ;
 		
 	}
     
//     -----------------------------------------------------------------------------------------------------
     
     @GetMapping("/FindFoodItemsByCategory")
     public ResponseEntity<ResponseStructure<List<FoodItem>>>getFoodItemsByCategory(@RequestParam long categoryId) {
         return service.getFoodItemsByCategory(categoryId);
     }

   
}
