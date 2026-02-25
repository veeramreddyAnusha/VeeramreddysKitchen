package com.veeramreddy.veeramreddys_kitchen.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.veeramreddy.veeramreddys_kitchen.Dao.CartItemDao;
import com.veeramreddy.veeramreddys_kitchen.Dto.Cart;
import com.veeramreddy.veeramreddys_kitchen.Dto.CartItem;
import com.veeramreddy.veeramreddys_kitchen.Exception.NoSuchElementFoundException;
import com.veeramreddy.veeramreddys_kitchen.Repo.CartItemRepo;
import com.veeramreddy.veeramreddys_kitchen.Repo.CartRepo;
import com.veeramreddy.veeramreddys_kitchen.Util.ResponseStructure;

@Service
public class CartItemService {
	
	@Autowired
	private CartItemDao dao;
	
	@Autowired
	private CartItemRepo repo;
	
	@Autowired
	private CartRepo cartrepo;
	
	
	 public ResponseEntity<ResponseStructure<CartItem>> addItem(
	            Long cartId, Long foodId, Integer quantity) {

	        CartItem savedItem = dao.addItem(cartId, foodId, quantity);

	        if (savedItem != null) {
	            ResponseStructure<CartItem> structure = new ResponseStructure<>();
	            structure.setStatus(HttpStatus.CREATED.value());
	            structure.setMessage("Item added to cart successfully");
	            structure.setData(savedItem);
	            return new ResponseEntity<>(structure, HttpStatus.CREATED);
	        } else {
	            throw new NoSuchElementFoundException(
	                "Cart or FoodItem not found"
	            );
	        }
	    }
	
//	-------------------------------------------------------------------------------------------------
	 
	 public CartItem deleteItem(Long cartItemId) {
		    Optional<CartItem> itemOpt = repo.findById(cartItemId);
		    if (itemOpt.isPresent()) {
		        CartItem item = itemOpt.get();
		        Cart cart = item.getCart();
		        
		        repo.delete(item);
		        
		       
		        List<CartItem> remainingItems = repo.findByCart_CartId(cart.getCartId());
		        if (remainingItems.isEmpty()) {
		            cartrepo.delete(cart);
		        }
		        
		        return item;
		    }
		    return null;
		}

	 
	 
	 
	 
//	 ------------------------------------------------------------------------------------------------------
	 
	 
	 
	
}
