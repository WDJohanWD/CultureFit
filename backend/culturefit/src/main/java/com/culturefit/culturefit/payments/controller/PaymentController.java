package com.culturefit.culturefit.payments.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.culturefit.culturefit.payments.service.PaymentService;

@Controller
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping("/membresias")
    public String mostrarProductos(Model model) {
        try {
            model.addAttribute("productos", paymentService.listarProductos());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "productos";
    }
}
