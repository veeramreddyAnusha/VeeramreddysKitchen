package com.veeramreddy.veeramreddys_kitchen.Dao;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.veeramreddy.veeramreddys_kitchen.Dto.Cart;
import com.veeramreddy.veeramreddys_kitchen.Dto.CartItem;
import com.veeramreddy.veeramreddys_kitchen.Dto.FoodItem;
import com.veeramreddy.veeramreddys_kitchen.Repo.CartItemRepo;
import com.veeramreddy.veeramreddys_kitchen.Repo.CartRepo;
import com.veeramreddy.veeramreddys_kitchen.Repo.FoodItemRepo;

@Repository
public class CartItemDao {
	
	@Autowired
	private CartItemRepo repo;
	
	@Autowired
	private CartRepo crepo;
	@Autowired
	private FoodItemRepo frepo;
	
	
	 public CartItem addItem(Long cartId, Long foodId, Integer quantity) {

	        Optional<Cart> cartOpt = crepo.findById(cartId);
	        Optional<FoodItem> foodOpt = frepo.findById(foodId);

	        if (cartOpt.isPresent() && foodOpt.isPresent()) {

	            FoodItem food = foodOpt.get();

	            CartItem item = new CartItem();
	            item.setCart(cartOpt.get());
	            item.setFoodItem(food);
	            item.setQuantity(quantity);
	            item.setPrice(food.getPrice() * quantity);
	            
	            return repo.save(item);
	        }
	        return null;
    }
	
//	--------------------------------------------------------------------------------------------
	
	 public CartItem deleteItem(Long cartItemId) {
	        Optional<CartItem> itemOpt = repo.findById(cartItemId);
	        if (itemOpt.isPresent()) {
	            CartItem item = itemOpt.get();
	            repo.delete(item);
	            return item;
	        }
	        return null;
	    }

//	  --------------------------------------------------------------------------------------------
	  
}
