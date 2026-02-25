package com.veeramreddy.veeramreddys_kitchen.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.veeramreddy.veeramreddys_kitchen.Dto.Payment;
import com.veeramreddy.veeramreddys_kitchen.Service.PaymentService;
import com.veeramreddy.veeramreddys_kitchen.Util.ResponseStructure;

@RestController
@CrossOrigin(origins = "*",methods = {RequestMethod.POST, RequestMethod.GET,RequestMethod.DELETE,RequestMethod.PUT})

public class PaymentController {

    @Autowired
    private PaymentService service;


    @PostMapping("/create/{orderId}")
    public ResponseEntity<ResponseStructure<Payment>> createPayment(
            @PathVariable Long orderId,
            @RequestBody Payment payment) {

        return service.createPayment(orderId, payment);
    }

    
    
//  ---------------------------------------------------------------------------------------------
 
    
    @GetMapping("/order/{orderId}")
    public ResponseEntity<ResponseStructure<Payment>> getPaymentByOrderId(
            @PathVariable Long orderId) {

        return service.getPaymentByOrderId(orderId);
    }

    
//  ---------------------------------------------------------------------------------------------
 
    
    @DeleteMapping("/delete/{paymentId}")
    public ResponseEntity<ResponseStructure<Payment>> deletePayment(
            @PathVariable Long paymentId) {

        return service.deletePayment(paymentId);
    }
    
    
//  ---------------------------------------------------------------------------------------------
     
}
