package com.veeramreddy.veeramreddys_kitchen.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.veeramreddy.veeramreddys_kitchen.Dto.OrderItem;
import com.veeramreddy.veeramreddys_kitchen.Service.OrderItemService;
import com.veeramreddy.veeramreddys_kitchen.Util.ResponseStructure;

@RestController
@RequestMapping("/order-items")
@CrossOrigin(origins = "*", methods = {RequestMethod.POST,RequestMethod.GET,RequestMethod.DELETE,RequestMethod.PUT})

public class OrderItemController {

    @Autowired
    private OrderItemService service;

    @PostMapping("/add/{orderId}")
    public ResponseEntity<ResponseStructure<OrderItem>> addOrderItem(
            @PathVariable Long orderId,
            @RequestBody OrderItem item) {
        return service.addOrderItem(orderId, item);
    }

    @GetMapping("/{orderItemId}")
    public ResponseEntity<ResponseStructure<OrderItem>> getOrderItemById(
            @PathVariable Long orderItemId) {
        return service.getOrderItemById(orderItemId);
    }

    @DeleteMapping("/{orderItemId}")
    public ResponseEntity<ResponseStructure<OrderItem>> deleteOrderItem(
            @PathVariable Long orderItemId) {
        return service.deleteOrderItem(orderItemId);
    }
}
