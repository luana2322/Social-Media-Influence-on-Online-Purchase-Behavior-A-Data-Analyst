package com.example.socialpurchase;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class SocialPurchaseApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(SocialPurchaseApplication.class, args);
        System.out.println("✅ Spring Boot Social Purchase Application started");
    }
    
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
