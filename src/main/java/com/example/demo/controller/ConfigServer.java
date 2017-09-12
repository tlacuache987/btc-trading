package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.config.BitsoTradingConfig;

@RestController
@RequestMapping("/config")
public class ConfigServer {

	@Autowired
	private BitsoTradingConfig config;

	@RequestMapping(method = RequestMethod.GET)
	public BitsoTradingConfig getConfig() {
		return config;
	}
}