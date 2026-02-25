package com.veeramreddy.veeramreddys_kitchen.Repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.veeramreddy.veeramreddys_kitchen.Dto.CartItem;

public interface CartItemRepo extends JpaRepository<CartItem, Long> {

	List<CartItem> findByCart_CartId(Long cartId);

}
