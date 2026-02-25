package com.veeramreddy.veeramreddys_kitchen.Dto;


import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import lombok.Data;

@Entity
@Data
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderItemId;

    @ManyToOne
    private Order order;

    @ManyToOne
    private FoodItem foodItem;

    private Integer quantity;
    private Double price;
}
