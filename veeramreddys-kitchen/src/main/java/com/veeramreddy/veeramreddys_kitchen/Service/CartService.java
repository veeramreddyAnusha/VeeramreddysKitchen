package com.veeramreddy.veeramreddys_kitchen.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.veeramreddy.veeramreddys_kitchen.Dao.CartDao;
import com.veeramreddy.veeramreddys_kitchen.Dto.Cart;
import com.veeramreddy.veeramreddys_kitchen.Dto.CartItem;
import com.veeramreddy.veeramreddys_kitchen.Exception.NoSuchElementFoundException;
import com.veeramreddy.veeramreddys_kitchen.Util.ResponseStructure;

@Service
public class CartService {
	
	@Autowired
	private CartDao dao;
	

	public ResponseEntity<ResponseStructure<Cart>> createCart(Long userId) {

        Cart cart = dao.createCart(userId);

        if (cart != null) {
            ResponseStructure<Cart> structure = new ResponseStructure<>();
            structure.setStatus(HttpStatus.CREATED.value());
            structure.setMessage("Cart created successfully");
            structure.setData(cart);

            return new ResponseEntity<>(structure, HttpStatus.CREATED);
        } else {
            throw new NoSuchElementFoundException(
                "User not found, cannot create cart for userId : " + userId
            );
        }
    }
	 
//	 ----------------------------------------------------------------------------------------------------------------------
	
       public ResponseEntity<ResponseStructure<Cart>> getCartByUserId(Long userId) {

		    Cart cart = dao.getCartByUserId(userId);

		    ResponseStructure<Cart> structure = new ResponseStructure<>();
		    structure.setStatus(HttpStatus.OK.value());
		    structure.setMessage("Cart fetched successfully");
		    structure.setData(cart);

		    return new ResponseEntity<>(structure, HttpStatus.OK);
		}

	
//	 ---------------------------------------------------------------------------------------------------
	 
	 public ResponseEntity<ResponseStructure<Cart>> deleteCart(Long cartId) {

	        Cart cart = dao.deleteCart(cartId);

	        if (cart != null) {
	            ResponseStructure<Cart> structure = new ResponseStructure<>();
	            structure.setStatus(HttpStatus.OK.value());
	            structure.setMessage("Cart deleted successfully");
	            structure.setData(cart);

	            return new ResponseEntity<>(structure, HttpStatus.OK);
	        } else {
	            throw new NoSuchElementFoundException(
	                "Cart not found with cartId : " + cartId
	            );
	        }
	    }
	 
//	 ----------------------------------------------------------------------------------------------------------------------
	 
}
