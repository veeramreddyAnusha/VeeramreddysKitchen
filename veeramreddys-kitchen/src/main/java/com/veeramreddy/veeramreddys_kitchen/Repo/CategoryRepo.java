package com.veeramreddy.veeramreddys_kitchen.Repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.veeramreddy.veeramreddys_kitchen.Dto.Category;

public interface CategoryRepo extends JpaRepository<Category, Long> {

	Category findByCategoryName(String categoryName);

	

}
