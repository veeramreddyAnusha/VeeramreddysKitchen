package com.veeramreddy.veeramreddys_kitchen.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.veeramreddy.veeramreddys_kitchen.Dto.Review;
import com.veeramreddy.veeramreddys_kitchen.Service.ReviewService;

@RestController
@RequestMapping("/reviews")
@CrossOrigin("*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

// ---------------------------------------------------------------------------------------------

    
    @PostMapping("/add/{foodId}/{userId}")
    public Review saveReview(@PathVariable Long foodId,
                             @PathVariable Long userId,
                             @RequestBody Review review) {

        return reviewService.saveReview(foodId, userId, review);
    }

// ---------------------------------------------------------------------------------------------

   
    @GetMapping("/{reviewId}")
    public Review getReviewById(@PathVariable Long reviewId) {
        return reviewService.getReviewById(reviewId);
    }

// ---------------------------------------------------------------------------------------------

  
    @GetMapping("/food/{foodId}")
    public List<Review> getReviewsByFoodId(@PathVariable Long foodId) {
        return reviewService.getReviewsByFoodId(foodId);
    }

// ---------------------------------------------------------------------------------------------

   
    @GetMapping("/all")
    public List<Review> getAllReviews() {
        return reviewService.getAllReviews();
    }

// ---------------------------------------------------------------------------------------------

 
    @PutMapping("/update")
    public Review updateReview(@RequestBody Review review) {
        return reviewService.updateReview(review);
    }

// ---------------------------------------------------------------------------------------------

   
    @DeleteMapping("/delete/{reviewId}")
    public Review deleteReview(@PathVariable Long reviewId) {
        return reviewService.deleteReview(reviewId);
    }

}