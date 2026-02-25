package com.veeramreddy.veeramreddys_kitchen.Dao;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.veeramreddy.veeramreddys_kitchen.Dto.App_User;
import com.veeramreddy.veeramreddys_kitchen.Dto.Order;
import com.veeramreddy.veeramreddys_kitchen.Repo.OrderRepo;
import com.veeramreddy.veeramreddys_kitchen.Repo.UserRepo;

@Repository
public class OrderDao {

    @Autowired
    private OrderRepo orderRepo;

    @Autowired
    private UserRepo userRepo;

    public Order createOrder(Long userId, Order order) {
        Optional<App_User> userOpt = userRepo.findById(userId);
        if (userOpt.isPresent()) {
            order.setUser(userOpt.get());
            order.setOrderTime(LocalDateTime.now());
            order.setStatus("PLACED");
            return orderRepo.save(order);
        }
        return null;
    }
    
//    --------------------------------------------------------------------------------------
    

    public Order getOrderById(Long orderId) {
        return orderRepo.findById(orderId).orElse(null);
    }
    
//    ----------------------------------------------------------------------------------------

    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepo.findByUser_UserId(userId);
    }
    
//    ------------------------------------------------------------------------------------------

    public Order deleteOrder(Long orderId) {
        Optional<Order> orderOpt = orderRepo.findById(orderId);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            orderRepo.delete(order);
            return order;
        }
        return null;
    }
    
//    ------------------------------------------------------------------------------------------
}
