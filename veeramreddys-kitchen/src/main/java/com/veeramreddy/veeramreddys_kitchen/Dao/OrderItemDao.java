package com.veeramreddy.veeramreddys_kitchen.Dao;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.veeramreddy.veeramreddys_kitchen.Dto.Order;
import com.veeramreddy.veeramreddys_kitchen.Dto.OrderItem;
import com.veeramreddy.veeramreddys_kitchen.Repo.OrderItemRepo;
import com.veeramreddy.veeramreddys_kitchen.Repo.OrderRepo;

@Repository
public class OrderItemDao {

    @Autowired
    private OrderItemRepo repo;

    @Autowired
    private OrderRepo orderRepo;

    public OrderItem addOrderItem(Long orderId, OrderItem item) {
        Optional<Order> orderOpt = orderRepo.findById(orderId);
        if (orderOpt.isPresent()) {
            item.setOrder(orderOpt.get());
            return repo.save(item);
        }
        return null;
    }
    
//    -------------------------------------------------------------------------------------------

    public OrderItem getOrderItemById(Long orderItemId) {
        return repo.findById(orderItemId).orElse(null);
    }
    
//    ----------------------------------------------------------------------------------------------

    public OrderItem deleteOrderItem(Long orderItemId) {
        Optional<OrderItem> itemOpt = repo.findById(orderItemId);
        if (itemOpt.isPresent()) {
            OrderItem item = itemOpt.get();
            repo.delete(item);
            return item;
        }
        return null;
    }
    
//    ----------------------------------------------------------------------------------------------------


}
