package com.veeramreddy.veeramreddys_kitchen.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.veeramreddy.veeramreddys_kitchen.Dto.Cart;
import com.veeramreddy.veeramreddys_kitchen.Service.CartService;
import com.veeramreddy.veeramreddys_kitchen.Util.ResponseStructure;

@RestController
@CrossOrigin(origins = "*",methods = {RequestMethod.POST, RequestMethod.GET,RequestMethod.DELETE,RequestMethod.PUT})

public class CartController {
	
	@Autowired
	private CartService service;
	
	 @PostMapping("/save/{userId}")
	    public ResponseEntity<ResponseStructure<Cart>> createCart( @PathVariable Long userId) {

	        return service.createCart(userId);
	    }
	 
//   -------------------------------------------------------------------------------------------------
	 
	 @GetMapping("/fetch/{userId}")
	    public ResponseEntity<ResponseStructure<Cart>> getCartByUserId(@PathVariable Long userId) {

	        return service.getCartByUserId(userId);
	    }
	 
//	 -------------------------------------------------------------------------------------------------
	 
	 @DeleteMapping("/delete/{cartId}")
	    public ResponseEntity<ResponseStructure<Cart>> deleteCart(@PathVariable Long cartId) {

	        return service.deleteCart(cartId);
	    }
	 
//	 -----------------------------------------------------------------------------------------------------

}
