package com.culturefit.culturefit.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.culturefit.culturefit.services.userService.UserService;

@Component
public class CouponsScheduler {
    @Autowired
    private UserService userService;

    // Ejecutar todos los días a las 2 AM
    @Scheduled(cron = "0 0 2 * * ?")
    public void checkForEliteCoupons() {
        userService.updateCouponsMonthly();
    }
}
