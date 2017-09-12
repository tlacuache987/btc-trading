package com.example.demo.domain;

import java.util.List;

import lombok.Data;

@Data
public class OrderBook {

	private String updated_at;

	private List<Bid> bids;

	private List<Ask> asks;

	private String sequence;
}
