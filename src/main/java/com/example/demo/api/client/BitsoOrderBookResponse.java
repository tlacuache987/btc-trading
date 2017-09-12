package com.example.demo.api.client;

import java.util.List;

import lombok.Data;

@Data
public class BitsoOrderBookResponse {

	private boolean success;

	private BitsoOrderBook payload;

}
