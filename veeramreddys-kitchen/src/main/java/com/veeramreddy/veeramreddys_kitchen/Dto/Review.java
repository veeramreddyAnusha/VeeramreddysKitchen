package com.veeramreddy.veeramreddys_kitchen.Dto;

import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import lombok.Data;

@Entity
@Data
public class Review {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long reviewId;
	private int rating;     
    private String comment;
    private LocalDateTime createdDate;
    
    @ManyToOne
    @JoinColumn(name = "food_id")
    private FoodItem foodItem;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private App_User user;
	
}
