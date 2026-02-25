package com.veeramreddy.veeramreddys_kitchen.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.veeramreddy.veeramreddys_kitchen.Dao.OrderDao;
import com.veeramreddy.veeramreddys_kitchen.Dto.Order;
import com.veeramreddy.veeramreddys_kitchen.Exception.NoSuchElementFoundException;
import com.veeramreddy.veeramreddys_kitchen.Util.ResponseStructure;

@Service
public class OrderService {

    @Autowired
    private OrderDao dao;

    public ResponseEntity<ResponseStructure<Order>> createOrder(Long userId, Order order) {
        Order savedOrder = dao.createOrder(userId, order);

        if (savedOrder != null) {
            ResponseStructure<Order> structure = new ResponseStructure<>();
            structure.setStatus(HttpStatus.CREATED.value());
            structure.setMessage("Order placed successfully");
            structure.setData(savedOrder);

            return new ResponseEntity<>(structure, HttpStatus.CREATED);
        } else {
            throw new NoSuchElementFoundException("User not found with id : " + userId);
        }
    }
    
//    --------------------------------------------------------------------------------------------------

    public ResponseEntity<ResponseStructure<Order>> getOrderById(Long orderId) {
        Order order = dao.getOrderById(orderId);

        if (order != null) {
            ResponseStructure<Order> structure = new ResponseStructure<>();
            structure.setStatus(HttpStatus.OK.value());
            structure.setMessage("Order found");
            structure.setData(order);

            return new ResponseEntity<>(structure, HttpStatus.OK);
        } else {
            throw new NoSuchElementFoundException("Order not found with id : " + orderId);
        }
    }
    
    
//  -------------------------------------------------------------------------------------------------

    public ResponseEntity<ResponseStructure<List<Order>>> getOrdersByUserId(Long userId) {
        List<Order> orders = dao.getOrdersByUserId(userId);

        ResponseStructure<List<Order>> structure = new ResponseStructure<>();
        structure.setStatus(HttpStatus.OK.value());
        structure.setMessage("Orders fetched successfully");
        structure.setData(orders);

        return new ResponseEntity<>(structure, HttpStatus.OK);
    }
    
    
//  -------------------------------------------------------------------------------------------------

    public ResponseEntity<ResponseStructure<Order>> deleteOrder(Long orderId) {
        Order deletedOrder = dao.deleteOrder(orderId);

        if (deletedOrder != null) {
            ResponseStructure<Order> structure = new ResponseStructure<>();
            structure.setStatus(HttpStatus.OK.value());
            structure.setMessage("Order deleted successfully");
            structure.setData(deletedOrder);

            return new ResponseEntity<>(structure, HttpStatus.OK);
        } else {
            throw new NoSuchElementFoundException("Order not found with id : " + orderId);
        }
    }
    
//  -------------------------------------------------------------------------------------------------
}
