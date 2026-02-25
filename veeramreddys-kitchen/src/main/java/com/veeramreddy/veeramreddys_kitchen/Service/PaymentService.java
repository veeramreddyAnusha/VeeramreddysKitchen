package com.veeramreddy.veeramreddys_kitchen.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.veeramreddy.veeramreddys_kitchen.Dao.PaymentDao;
import com.veeramreddy.veeramreddys_kitchen.Dto.Payment;
import com.veeramreddy.veeramreddys_kitchen.Exception.NoSuchElementFoundException;
import com.veeramreddy.veeramreddys_kitchen.Util.ResponseStructure;

@Service
public class PaymentService {

    @Autowired
    private PaymentDao dao;

   
    public ResponseEntity<ResponseStructure<Payment>> createPayment(Long orderId, Payment payment) {

        Payment savedPayment = dao.createPayment(orderId, payment);

        if (savedPayment != null) {
            ResponseStructure<Payment> structure = new ResponseStructure<>();
            structure.setStatus(HttpStatus.CREATED.value());
            structure.setMessage("Payment completed successfully");
            structure.setData(savedPayment);

            return new ResponseEntity<>(structure, HttpStatus.CREATED);
        } else {
            throw new NoSuchElementFoundException("Order not found with id : " + orderId);
        }
    }
    
    

// -------------------------------------------------------------------------------------------------
   
    
    public ResponseEntity<ResponseStructure<Payment>> getPaymentByOrderId(Long orderId) {

        Payment payment = dao.getPaymentByOrderId(orderId);

        if (payment != null) {
            ResponseStructure<Payment> structure = new ResponseStructure<>();
            structure.setStatus(HttpStatus.FOUND.value());
            structure.setMessage("Payment details found");
            structure.setData(payment);

            return new ResponseEntity<>(structure, HttpStatus.FOUND);
        } else {
            throw new NoSuchElementFoundException("Payment not found for orderId : " + orderId);
        }
    }
    

// -------------------------------------------------------------------------------------------------
   
    
    public ResponseEntity<ResponseStructure<Payment>> deletePayment(Long paymentId) {

        Payment payment = dao.deletePayment(paymentId);

        if (payment != null) {
            ResponseStructure<Payment> structure = new ResponseStructure<>();
            structure.setStatus(HttpStatus.OK.value());
            structure.setMessage("Payment deleted successfully");
            structure.setData(payment);

            return new ResponseEntity<>(structure, HttpStatus.OK);
        } else {
            throw new NoSuchElementFoundException("Payment not found with id : " + paymentId);
        }
    }
}
