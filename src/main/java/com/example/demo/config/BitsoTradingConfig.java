package com.example.demo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.Data;

@Data
@Component
public class BitsoTradingConfig {

	@Value("${config.x:20}")
	private String x;

	@Value("${config.m:2}")
	private String m;

	@Value("${config.n:2}")
	private String n;
}
