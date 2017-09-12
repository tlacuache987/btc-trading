package com.example.demo.api.client;

import java.util.List;

import lombok.Data;

@Data
public class BitsoOrderBook {
	
	private String updated_at;
	
	private List<BitsoBid> bids;
	
	private List<BitsoAsk> asks;
	
	private String sequence;
}
