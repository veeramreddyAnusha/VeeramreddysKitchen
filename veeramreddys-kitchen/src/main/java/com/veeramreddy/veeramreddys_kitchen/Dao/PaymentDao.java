package com.veeramreddy.veeramreddys_kitchen.Dao;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.veeramreddy.veeramreddys_kitchen.Dto.Order;
import com.veeramreddy.veeramreddys_kitchen.Dto.Payment;
import com.veeramreddy.veeramreddys_kitchen.Repo.OrderRepo;
import com.veeramreddy.veeramreddys_kitchen.Repo.PaymentRepo;

@Repository
public class PaymentDao {

    @Autowired
    private PaymentRepo repo;

    @Autowired
    private OrderRepo orderRepo;


    public Payment createPayment(Long orderId, Payment payment) {

        Optional<Order> orderOpt = orderRepo.findById(orderId);

        if (orderOpt.isPresent()) {
            payment.setOrder(orderOpt.get());
            return repo.save(payment);
        }
        return null;
    }

 
//    ---------------------------------------------------------------------------------------------
    
    
    public Payment getPaymentByOrderId(Long orderId) {
        return repo.findByOrder_OrderId(orderId);
    }
    
    
    
//  ---------------------------------------------------------------------------------------------
 
    
    public Payment deletePayment(Long paymentId) {

        Optional<Payment> paymentOpt = repo.findById(paymentId);

        if (paymentOpt.isPresent()) {
            Payment payment = paymentOpt.get();
            repo.delete(payment);
            return payment;
        }
        return null;
    }
}
