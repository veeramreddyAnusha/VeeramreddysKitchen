package com.veeramreddy.veeramreddys_kitchen.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.veeramreddy.veeramreddys_kitchen.OtpService;
import com.veeramreddy.veeramreddys_kitchen.Dto.App_User;
import com.veeramreddy.veeramreddys_kitchen.Repo.UserRepo;
import com.veeramreddy.veeramreddys_kitchen.Service.EmailService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private OtpService otpService;

    @Autowired
    private EmailService emailService;

    // ✅ SEND OTP
    @PostMapping("/send-otp")
    public String sendOtp(@RequestParam String email) {

        App_User user = userRepo.findByEmail(email);

        if (user == null) {
            return "User not found";
        }

        String otp = otpService.generateOtp(email);
        emailService.sendOtp(email, otp);

        return "OTP sent successfully";
    }

    // ✅ VERIFY OTP
    @PostMapping("/verify-otp")
    public String verifyOtp(@RequestParam String email, @RequestParam String otp) {

        if (otpService.validateOtp(email, otp)) {
            return "OTP verified";
        }

        return "Invalid OTP";
    }

    // ✅ RESET PASSWORD
    @PostMapping("/reset-password")
    public String resetPassword(@RequestParam String email,
                                @RequestParam String newPassword) {

        App_User user = userRepo.findByEmail(email);

        if (user == null) {
            return "User not found";
        }
  
        user.setPassword(newPassword);
        userRepo.save(user);

        otpService.clearOtp(email);

        return "Password updated successfully";
    }
}