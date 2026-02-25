package com.veeramreddy.veeramreddys_kitchen.Dao;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.veeramreddy.veeramreddys_kitchen.Dto.Review;
import com.veeramreddy.veeramreddys_kitchen.Dto.FoodItem;
import com.veeramreddy.veeramreddys_kitchen.Dto.App_User;
import com.veeramreddy.veeramreddys_kitchen.Repo.ReviewRepo;
import com.veeramreddy.veeramreddys_kitchen.Repo.FoodItemRepo;
import com.veeramreddy.veeramreddys_kitchen.Repo.UserRepo;

@Repository
public class ReviewDao {


    @Autowired
    private ReviewRepo reviewRepo;

    @Autowired
    private FoodItemRepo foodItemRepo;

    @Autowired
    private UserRepo userRepo;


// ---------------------------------------------------------------------------------------------

    public Review saveReview(Long foodId, Long userId, Review review) {

        Optional<FoodItem> food = foodItemRepo.findById(foodId);
        Optional<App_User> user = userRepo.findById(userId);

        if (food.isPresent() && user.isPresent()) {

            review.setFoodItem(food.get());
            review.setUser(user.get());
            review.setCreatedDate(LocalDateTime.now());

            return reviewRepo.save(review);
        }

        return null;
    }


// ---------------------------------------------------------------------------------------------

    public Review deleteReview(Long reviewId) {

        Optional<Review> review = reviewRepo.findById(reviewId);

        if (review.isPresent()) {
            Review rev = review.get();
            reviewRepo.delete(rev);
            return rev;
        }

        return null;
    }


// ---------------------------------------------------------------------------------------------

    public Review getReviewById(Long reviewId) {

        if (reviewRepo.findById(reviewId).isPresent()) {
            return reviewRepo.findById(reviewId).get();
        }

        return null;
    }


// ---------------------------------------------------------------------------------------------

    public List<Review> getReviewsByFoodId(Long foodId) {

        return reviewRepo.findByFoodItemFoodId(foodId);
    }


// ---------------------------------------------------------------------------------------------

    public List<Review> getAllReviews() {

        return reviewRepo.findAll();
    }


// ---------------------------------------------------------------------------------------------

    public Review updateReview(Review review) {

        Optional<Review> existingReview = reviewRepo.findById(review.getReviewId());

        if (existingReview.isPresent()) {

            Review oldReview = existingReview.get();

            if (review.getRating() == 0) {
                review.setRating(oldReview.getRating());
            }

            if (review.getComment() == null) {
                review.setComment(oldReview.getComment());
            }

            review.setFoodItem(oldReview.getFoodItem());
            review.setUser(oldReview.getUser());
            review.setCreatedDate(oldReview.getCreatedDate());

            return reviewRepo.save(review);
        }

        return null;
    }

}