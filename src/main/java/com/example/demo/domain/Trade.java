package com.example.demo.domain;

import lombok.Data;

@Data
public class Trade {

	private Long tid;

	private String book;

	private String created_at;

	private String amount;

	private String maker_side;

	private String price;
}
