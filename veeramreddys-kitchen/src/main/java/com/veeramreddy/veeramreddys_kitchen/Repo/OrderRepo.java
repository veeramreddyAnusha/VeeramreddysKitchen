package com.veeramreddy.veeramreddys_kitchen.Repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.veeramreddy.veeramreddys_kitchen.Dto.Order;

public interface OrderRepo extends JpaRepository<Order, Long> {

	List<Order> findByUser_UserId(Long userId);

}
