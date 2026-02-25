package com.veeramreddy.veeramreddys_kitchen.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.veeramreddy.veeramreddys_kitchen.Dao.OrderItemDao;
import com.veeramreddy.veeramreddys_kitchen.Dto.OrderItem;
import com.veeramreddy.veeramreddys_kitchen.Exception.NoSuchElementFoundException;
import com.veeramreddy.veeramreddys_kitchen.Util.ResponseStructure;

@Service
public class OrderItemService {

    @Autowired
    private OrderItemDao dao;

    public ResponseEntity<ResponseStructure<OrderItem>> addOrderItem(Long orderId, OrderItem item) {

        OrderItem savedItem = dao.addOrderItem(orderId, item);

        if (savedItem != null) {
            ResponseStructure<OrderItem> structure = new ResponseStructure<>();
            structure.setStatus(HttpStatus.CREATED.value());
            structure.setMessage("Order item added successfully");
            structure.setData(savedItem);

            return new ResponseEntity<>(structure, HttpStatus.CREATED);
        } else {
            throw new NoSuchElementFoundException(
                    "Order not found, cannot add item to orderId : " + orderId);
        }
    }
    
//    ---------------------------------------------------------------------------------------------------

    public ResponseEntity<ResponseStructure<OrderItem>> getOrderItemById(Long orderItemId) {

        OrderItem item = dao.getOrderItemById(orderItemId);

        if (item != null) {
            ResponseStructure<OrderItem> structure = new ResponseStructure<>();
            structure.setStatus(HttpStatus.OK.value());
            structure.setMessage("Order item found");
            structure.setData(item);

            return new ResponseEntity<>(structure, HttpStatus.OK);
        } else {
            throw new NoSuchElementFoundException(
                    "Order item not found with id : " + orderItemId);
        }
    }
    
    
//  ---------------------------------------------------------------------------------------------------


    public ResponseEntity<ResponseStructure<OrderItem>> deleteOrderItem(Long orderItemId) {

        OrderItem deletedItem = dao.deleteOrderItem(orderItemId);

        if (deletedItem != null) {
            ResponseStructure<OrderItem> structure = new ResponseStructure<>();
            structure.setStatus(HttpStatus.OK.value());
            structure.setMessage("Order item deleted successfully");
            structure.setData(deletedItem);

            return new ResponseEntity<>(structure, HttpStatus.OK);
        } else {
            throw new NoSuchElementFoundException(
                    "Order item not found with id : " + orderItemId);
        }
    }
    
    
//  ---------------------------------------------------------------------------------------------------

}
