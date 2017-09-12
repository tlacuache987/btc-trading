package com.example.demo.api.client;

import java.util.List;

import lombok.Data;

@Data
public class BitsoTradeResponse {

	private boolean success;

	private List<BitsoTrade> payload;

}
