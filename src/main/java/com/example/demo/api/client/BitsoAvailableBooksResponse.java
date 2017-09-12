package com.example.demo.api.client;

import java.util.List;

import lombok.Data;

@Data
public class BitsoAvailableBooksResponse {

	private boolean success;

	private List<BitsoBook> payload;

}
