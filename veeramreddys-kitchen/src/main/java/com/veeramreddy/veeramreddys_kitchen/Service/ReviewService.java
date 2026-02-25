package com.veeramreddy.veeramreddys_kitchen.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.veeramreddy.veeramreddys_kitchen.Dao.ReviewDao;
import com.veeramreddy.veeramreddys_kitchen.Dto.Review;

@Service
public class ReviewService {

    @Autowired
    private ReviewDao reviewDao;

// ---------------------------------------------------------------------------------------------

    public Review saveReview(Long foodId, Long userId, Review review) {

        // Basic validation
        if (review.getRating() < 1 || review.getRating() > 5) {
            return null; // you can improve with custom exception later
        }

        return reviewDao.saveReview(foodId, userId, review);
    }

// ---------------------------------------------------------------------------------------------

    public Review deleteReview(Long reviewId) {
        return reviewDao.deleteReview(reviewId);
    }

// ---------------------------------------------------------------------------------------------

    public Review getReviewById(Long reviewId) {
        return reviewDao.getReviewById(reviewId);
    }

// ---------------------------------------------------------------------------------------------

    public List<Review> getReviewsByFoodId(Long foodId) {
        return reviewDao.getReviewsByFoodId(foodId);
    }

// ---------------------------------------------------------------------------------------------

    public List<Review> getAllReviews() {
        return reviewDao.getAllReviews();
    }

// ---------------------------------------------------------------------------------------------

    public Review updateReview(Review review) {

        if (review.getRating() < 1 || review.getRating() > 5) {
            return null;
        }

        return reviewDao.updateReview(review);
    }

}