package com.example.demo.api.client;

import lombok.Data;

@Data
public class BitsoTrade {

	private Long tid;

	private String book;

	private String created_at;

	private String amount;

	private String maker_side;

	private String price;
}
