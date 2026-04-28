package com.example.socialpurchase;

import com.example.socialpurchase.service.JobWorkerService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;

@SpringBootApplication
public class SocialPurchaseApplication {

    @Autowired
    private JobWorkerService jobWorkerService;

    public static void main(String[] args) {
        SpringApplication.run(SocialPurchaseApplication.class, args);
        System.out.println("✅ Spring Boot Social Purchase Application started");
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @PostConstruct
    public void init() {
        jobWorkerService.startWorker();
    }
}
