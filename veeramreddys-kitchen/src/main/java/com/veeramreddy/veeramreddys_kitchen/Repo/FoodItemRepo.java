package com.veeramreddy.veeramreddys_kitchen.Repo;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.veeramreddy.veeramreddys_kitchen.Dto.FoodItem;

public interface FoodItemRepo extends JpaRepository<FoodItem, Long> {

	List<FoodItem> findByCategory_CategoryId(long categoryId);

	long countByCategory_CategoryId(long categoryId);
	 @Modifying
	    @Query("UPDATE FoodItem f SET f.category = NULL WHERE f.category.categoryId = :categoryId")
	    void removeCategoryFromFoodItems(@Param("categoryId") long categoryId);

    
}
