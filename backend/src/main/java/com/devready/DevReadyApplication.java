package com.devready;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DevReadyApplication {

	public static void main(String[] args) {
		SpringApplication.run(DevReadyApplication.class, args);
	}

}
