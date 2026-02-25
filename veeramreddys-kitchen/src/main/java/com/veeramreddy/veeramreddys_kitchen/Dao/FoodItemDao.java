package com.veeramreddy.veeramreddys_kitchen.Dao;

import java.util.List;

import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.veeramreddy.veeramreddys_kitchen.Dto.Category;
import com.veeramreddy.veeramreddys_kitchen.Dto.FoodItem;
import com.veeramreddy.veeramreddys_kitchen.Repo.CategoryRepo;
import com.veeramreddy.veeramreddys_kitchen.Repo.FoodItemRepo;

@Repository
public class FoodItemDao {

    @Autowired
    private FoodItemRepo repo;
    
    @Autowired
    private CategoryRepo categoryRepo;

    public FoodItem saveFoodItem(FoodItem foodItem) {
        return repo.save(foodItem);
    }
   


//	-----------------------------------------------------------------------------------
	
    public List<FoodItem> getAllFood() {
        return repo.findAll();
    }
	
//	-----------------------------------------------------------------------------------

    public FoodItem DeleteFoodItem(long foodId) {
        Optional<FoodItem> foodrepo = repo.findById(foodId);
        if (foodrepo.isPresent()) {
            FoodItem fooditem = foodrepo.get();
            repo.delete(fooditem);
            return fooditem;
        }
        return null;
    }

//	-----------------------------------------------------------------------------------

    public FoodItem UpdateFoodItem(FoodItem newData) {
        FoodItem existing = repo.findById(newData.getFoodId()).orElse(null);
        if(existing == null) return null;

        if(newData.getName() != null) existing.setName(newData.getName());
        if(newData.getQuantity() != null) existing.setQuantity(newData.getQuantity());
        if(newData.getPrice() != null) existing.setPrice(newData.getPrice());
        if(newData.getImage() != null) existing.setImage(newData.getImage());
        if (newData.getCategory() != null &&
                newData.getCategory().getCategoryId() != null) {

                Category category = categoryRepo
                        .findById(newData.getCategory().getCategoryId())
                        .orElseThrow(() -> new RuntimeException("Category not found"));

                existing.setCategory(category);
            }

            return repo.save(existing);
    }
	

//	-----------------------------------------------------------------------------------

	 public FoodItem getFoodItemById(long foodId) {
	        return repo.findById(foodId).orElse(null);
	    }

	 
//		-----------------------------------------------------------------------------------


	public List<FoodItem> getAllFoodItems() {
		return repo.findAll();
	}

//	-----------------------------------------------------------------------------------
	
	public List<FoodItem> getFoodItemsByCategoryId(long categoryId) {
	    return repo.findByCategory_CategoryId(categoryId);
	}


//	------------------------------------------------------------------------------------------

	 public long countByCategoryId(long categoryId) {
	        return repo.countByCategory_CategoryId(categoryId);
	    }

	
//	-------------------------------------------------------------------------------------------
	
	 @Transactional
	    public void detachCategory(long categoryId) {
	        repo.removeCategoryFromFoodItems(categoryId);
	    }
	
}
