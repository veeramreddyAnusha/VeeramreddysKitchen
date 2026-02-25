package com.veeramreddy.veeramreddys_kitchen.Dao;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.veeramreddy.veeramreddys_kitchen.Dto.Admin;
import com.veeramreddy.veeramreddys_kitchen.Dto.Category;
import com.veeramreddy.veeramreddys_kitchen.Repo.CategoryRepo;

@Repository
public class CategoryDao {

	@Autowired
	private CategoryRepo repo;
	
	public Category saveCategory(Category category) {
		return repo.save(category);
		
	}
	
//	------------------------------------------------------------------------------------------
	
	public Category deleteCategory(Long categoryId) {
        Optional<Category> optional = repo.findById(categoryId);

        if (optional.isPresent()) {
            Category category = optional.get();
            repo.delete(category);
            return category;
        }
        return null;
    }

	
//	---------------------------------------------------------------------------------------------
	
	public Category getCategoryByName(String categoryName) {
		Category category=repo.findByCategoryName(categoryName);
		if( category!=null) {
			return category;
			
		} else
		return null;
	}
	
	
//	----------------------------------------------------------------------------------------------
	

	public Category getCategoryById(long categoryId) {
		 if (repo.findById((long) categoryId).isPresent()) {
			   Category category=repo.findById(categoryId).get();
			   return category;
		   }
		   
		return null;
	}
	
//	-------------------------------------------------------------------------------------------
	
	 public Category updateCategory(Category category) {
	        return repo.save(category);
	    }


	
	
//	---------------------------------------------------------------------------------------------
	
	 public List<Category> getAllCategorys(){
			return repo.findAll();
			   
		   }
	
//	---------------------------------------------------------------------------------------------
	
	
}
