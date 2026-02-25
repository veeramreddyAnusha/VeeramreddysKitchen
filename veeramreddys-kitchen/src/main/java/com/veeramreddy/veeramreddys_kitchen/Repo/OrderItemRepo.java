package com.veeramreddy.veeramreddys_kitchen.Repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.veeramreddy.veeramreddys_kitchen.Dto.Order;
import com.veeramreddy.veeramreddys_kitchen.Dto.OrderItem;

public interface OrderItemRepo extends JpaRepository<OrderItem, Long> {

}
