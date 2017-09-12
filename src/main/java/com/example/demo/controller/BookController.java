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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.example.demo.api.client.BitsoAvailableBooksResponse;
import com.example.demo.api.client.BitsoOrderBook;
import com.example.demo.api.client.BitsoOrderBookResponse;
import com.example.demo.config.BitsoTradingConfig;
import com.example.demo.domain.Ask;
import com.example.demo.domain.Bid;
import com.example.demo.domain.Book;
import com.example.demo.domain.OrderBook;

@RestController
@RequestMapping("/books")
public class BookController {

	@Autowired
	private BitsoTradingConfig config;

	@Autowired
	private RestTemplate restTemplate;

	private static final String AVAILABLE_BOOKS_URI = "https://api.bitso.com/v3/available_books";
	private static final String ORDER_BOOK_URI = "https://api.bitso.com/v3/order_book";

	@RequestMapping(value = "/available", method = RequestMethod.GET)
	public List<Book> getAvailableBooks() {
		HttpHeaders headers = new HttpHeaders();

		UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(AVAILABLE_BOOKS_URI);

		headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
		headers.add("user-agent", "REST-TEMPLATE");

		HttpEntity<?> entity = new HttpEntity<>(headers);

		HttpEntity<BitsoAvailableBooksResponse> response = null;

		URI uri = builder.build().encode().toUri();

		try {
			response = restTemplate.exchange(uri, HttpMethod.GET, entity, BitsoAvailableBooksResponse.class);
		} catch (Exception ex) {
			System.err.println(ex.getMessage());
		}

		return response != null && response.getBody().isSuccess() ? response.getBody().getPayload().stream().map(bitsoAvailableBook -> {
			Book b = new Book();
			b.setBook(bitsoAvailableBook.getBook());
			b.setMinimum_amount(bitsoAvailableBook.getMinimum_amount());
			b.setMaximum_amount(bitsoAvailableBook.getMaximum_amount());
			b.setMinimum_price(bitsoAvailableBook.getMinimum_price());
			b.setMaximum_price(bitsoAvailableBook.getMaximum_price());
			b.setMinimum_value(bitsoAvailableBook.getMinimum_value());
			b.setMaximum_value(bitsoAvailableBook.getMaximum_value());
			return b;
		}).limit(Long.valueOf(config.getX())).collect(Collectors.toList()) : new ArrayList<Book>();
	}

	@RequestMapping(value = "/{book}/orders", method = RequestMethod.GET)
	public OrderBook getOrderBook(@PathVariable(name = "book") String book) {
		HttpHeaders headers = new HttpHeaders();

		UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(ORDER_BOOK_URI).queryParam("book", book).queryParam("aggregate", false);

		headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
		headers.add("user-agent", "REST-TEMPLATE");

		HttpEntity<?> entity = new HttpEntity<>(headers);

		HttpEntity<BitsoOrderBookResponse> response = null;

		URI uri = builder.build().encode().toUri();

		try {
			response = restTemplate.exchange(uri, HttpMethod.GET, entity, BitsoOrderBookResponse.class);
		} catch (Exception ex) {
			System.err.println(ex.getMessage());
		}

		if (response != null && response.getBody().isSuccess()) {
			BitsoOrderBook bitsoOrderBook = response.getBody().getPayload();
			OrderBook orderBook = new OrderBook();
			orderBook.setUpdated_at(bitsoOrderBook.getUpdated_at());
			orderBook.setSequence(bitsoOrderBook.getSequence());

			orderBook.setBids(bitsoOrderBook.getBids().stream().limit(50L).map(bitsoBid -> {
				Bid bid = new Bid();
				bid.setPrice(bitsoBid.getPrice());
				bid.setAmount(bitsoBid.getAmount());
				bid.setBook(bitsoBid.getBook());
				bid.setOid(bitsoBid.getOid());
				return bid;
			}).collect(Collectors.toList()));

			orderBook.setAsks(bitsoOrderBook.getAsks().stream().limit(50L).map(bitsoAsk -> {
				Ask ask = new Ask();
				ask.setPrice(bitsoAsk.getPrice());
				ask.setAmount(bitsoAsk.getAmount());
				ask.setBook(bitsoAsk.getBook());
				ask.setOid(bitsoAsk.getOid());
				return ask;
			}).collect(Collectors.toList()));

			return orderBook;
		} else {
			return new OrderBook();
		}
	}
}