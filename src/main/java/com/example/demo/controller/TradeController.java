package com.example.demo.controller;

import java.net.URI;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.example.demo.api.client.BitsoTradeResponse;
import com.example.demo.config.BitsoTradingConfig;
import com.example.demo.domain.Trade;

@RestController
@RequestMapping("/trades")
public class TradeController {

	@Autowired
	private BitsoTradingConfig config;

	@Autowired
	private RestTemplate restTemplate;

	private static final String TRADES_URI = "https://api.bitso.com/v3/trades";

	@RequestMapping(method = RequestMethod.GET)
	public List<Trade> getTrades(@RequestParam(name = "marker", required = false) Long marker) {
		HttpHeaders headers = new HttpHeaders();

		UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(TRADES_URI).queryParam("book", "btc_mxn");
		
		if(marker!=null){
			builder.queryParam("marker", marker).queryParam("sort", "asc");
		}

		headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
		headers.add("user-agent", "REST-TEMPLATE");

		HttpEntity<?> entity = new HttpEntity<>(headers);

		HttpEntity<BitsoTradeResponse> response = null;

		URI uri = builder.build().encode().toUri();
		
		System.out.println(uri);

		try {
			response = restTemplate.exchange(uri, HttpMethod.GET, entity, BitsoTradeResponse.class);
		} catch (Exception ex) {
			System.err.println(ex.getMessage());
		}
		
		if(response != null && response.getBody().isSuccess()){
			response.getBody().getPayload().forEach(bt ->{
				System.out.print(bt.getTid() + ", ");
			});
			System.out.println();
		}

		return response != null && response.getBody().isSuccess() ? response.getBody().getPayload().stream().map(bitsoTrade -> {
			Trade t = new Trade();
			t.setTid(bitsoTrade.getTid());
			t.setBook(bitsoTrade.getBook());
			t.setAmount(bitsoTrade.getAmount());
			t.setCreated_at(bitsoTrade.getCreated_at());
			t.setMaker_side(bitsoTrade.getMaker_side());
			t.setPrice(bitsoTrade.getPrice());
			return t;
		}).sorted((trade1, trade2)->Long.compare(trade2.getTid(), trade1.getTid())).collect(Collectors.toList()) : new ArrayList<Trade>(); //limit(Long.valueOf(config.getX()))
	}
}