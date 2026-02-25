package com.veeramreddy.veeramreddys_kitchen.Repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.veeramreddy.veeramreddys_kitchen.Dto.Cart;

public interface CartRepo extends JpaRepository<Cart, Long> {

	Optional<Cart> findByUser_UserId(Long userId);

}
