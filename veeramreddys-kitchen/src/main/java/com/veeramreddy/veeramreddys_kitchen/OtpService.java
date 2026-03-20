package com.veeramreddy.veeramreddys_kitchen;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

@Component
public class OtpService {

    private Map<String, String> otpMap = new HashMap<>();

    public String generateOtp(String email) {
        String otp = String.valueOf((int)(Math.random() * 900000) + 100000);
        otpMap.put(email, otp);
        return otp;
    }

    public boolean validateOtp(String email, String otp) {
        return otp.equals(otpMap.get(email));
    }

    public void clearOtp(String email) {
        otpMap.remove(email);
    }
}
