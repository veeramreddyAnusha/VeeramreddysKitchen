package com.veeramreddy.veeramreddys_kitchen.Repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.veeramreddy.veeramreddys_kitchen.Dto.Payment;

public interface PaymentRepo extends JpaRepository<Payment, Long> {

    Payment findByOrder_OrderId(Long orderId);
}