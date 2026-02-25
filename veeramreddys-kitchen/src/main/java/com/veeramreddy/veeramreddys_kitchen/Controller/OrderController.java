package com.veeramreddy.veeramreddys_kitchen.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.veeramreddy.veeramreddys_kitchen.Dto.Order;
import com.veeramreddy.veeramreddys_kitchen.Service.OrderService;
import com.veeramreddy.veeramreddys_kitchen.Util.ResponseStructure;

import java.util.List;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "*", methods = {RequestMethod.POST,RequestMethod.GET,RequestMethod.DELETE,RequestMethod.PUT})

public class OrderController {

    @Autowired
    private OrderService service;

    @PostMapping("/create/{userId}")
    public ResponseEntity<ResponseStructure<Order>> createOrder(
            @PathVariable Long userId,
            @RequestBody Order order) {
        return service.createOrder(userId, order);
    }
    
//    --------------------------------------------------------------------------------------------

    @GetMapping("/{orderId}")
    public ResponseEntity<ResponseStructure<Order>> getOrderById(@PathVariable Long orderId) {
        return service.getOrderById(orderId);
    }
    
//  --------------------------------------------------------------------------------------------


    @GetMapping("/user/{userId}")
    public ResponseEntity<ResponseStructure<List<Order>>> getOrdersByUserId(
            @PathVariable Long userId) {
        return service.getOrdersByUserId(userId);
    }
    
    
//  --------------------------------------------------------------------------------------------


    @DeleteMapping("/{orderId}")
    public ResponseEntity<ResponseStructure<Order>> deleteOrder(@PathVariable Long orderId) {
        return service.deleteOrder(orderId);
    }
    
//  --------------------------------------------------------------------------------------------

}
