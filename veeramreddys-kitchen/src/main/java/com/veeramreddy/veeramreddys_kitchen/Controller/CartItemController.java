package com.veeramreddy.veeramreddys_kitchen.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.veeramreddy.veeramreddys_kitchen.Dto.CartItem;
import com.veeramreddy.veeramreddys_kitchen.Service.CartItemService;
import com.veeramreddy.veeramreddys_kitchen.Util.ResponseStructure;

@RestController
@CrossOrigin(origins = "*",methods = {RequestMethod.POST, RequestMethod.GET,RequestMethod.DELETE,RequestMethod.PUT})

public class CartItemController {

	@Autowired
	private CartItemService service;
	
	@PostMapping("/add")
    public ResponseEntity<ResponseStructure<CartItem>> addItemToCart(@RequestParam Long cartId, @RequestParam Long foodId, @RequestParam Integer quantity) {
        return service.addItem(cartId, foodId, quantity);
    }
	 
//	 -----------------------------------------------------------------------------------------------

	 
	 @DeleteMapping("/deleteCartItem/{cartItemId}")
	    public CartItem deleteItemFromCart(@PathVariable Long cartItemId) {
	        return service.deleteItem(cartItemId);
	    }
	 

}
