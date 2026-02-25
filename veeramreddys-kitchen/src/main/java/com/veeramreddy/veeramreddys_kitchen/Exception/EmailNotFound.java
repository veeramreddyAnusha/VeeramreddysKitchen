package com.veeramreddy.veeramreddys_kitchen.Exception;

public class EmailNotFound extends RuntimeException {

	private String message="email not found please enter correct email";
	
	public EmailNotFound(String message) {
		super();
		this.message=message;
		
	}
	public EmailNotFound() {
		super();
	}
	
}
