package com.veeramreddy.veeramreddys_kitchen.Dao;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.veeramreddy.veeramreddys_kitchen.Dto.App_User;
import com.veeramreddy.veeramreddys_kitchen.Dto.Cart;
import com.veeramreddy.veeramreddys_kitchen.Repo.CartRepo;
import com.veeramreddy.veeramreddys_kitchen.Repo.UserRepo;

@Repository
public class CartDao {
	
	@Autowired
	private CartRepo repo;
	
	@Autowired
	private UserRepo urepo;
	
	public Cart createCart(Long userId) {
        Optional<App_User> userOpt = urepo.findById(userId);

        if (userOpt.isPresent()) {
            Cart cart = new Cart();
            cart.setUser(userOpt.get());
            return repo.save(cart);
        }
        return null;
    }
	 
//	 --------------------------------------------------------------------------------------------
	 
	public Cart getCartByUserId(Long userId) {
		    Optional<Cart> existingCart = repo.findByUser_UserId(userId);
		    if (existingCart.isPresent()) {
		        return existingCart.get(); 
		    }
		    
		    Optional<App_User> userOpt = urepo.findById(userId);
		    if (userOpt.isPresent()) {
		        Cart cart = new Cart();
		        cart.setUser(userOpt.get());
		        return repo.save(cart);
		    }
		    return null; 
		}

		public Cart getCartByUserId1(Long userId) {
		    return repo.findByUser_UserId(userId).orElse(null);
		}


	 
//	 ----------------------------------------------------------------------------------------------
	 
	  public Cart deleteCart(Long cartId) {
	        Optional<Cart> cartOpt = repo.findById(cartId);
	        if (cartOpt.isPresent()) {
	            Cart cart = cartOpt.get();
	            repo.delete(cart);
	            return cart;
	        }
	        return null;
	    }
// ------------------------------------------------------------------------------------------------------
	 
	
}
