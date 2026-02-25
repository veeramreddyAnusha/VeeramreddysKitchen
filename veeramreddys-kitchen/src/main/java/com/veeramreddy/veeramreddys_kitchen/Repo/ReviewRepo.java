package com.veeramreddy.veeramreddys_kitchen.Repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.veeramreddy.veeramreddys_kitchen.Dto.Review;

public interface ReviewRepo extends JpaRepository<Review, Long> {

	List<Review> findByFoodItemFoodId(Long foodId);

}
