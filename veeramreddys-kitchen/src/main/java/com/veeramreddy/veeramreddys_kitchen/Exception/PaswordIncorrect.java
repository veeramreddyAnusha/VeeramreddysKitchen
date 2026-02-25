package com.veeramreddy.veeramreddys_kitchen.Exception;

import lombok.Data;

@Data
public class PaswordIncorrect extends RuntimeException {
	
	private String message="Incorrect password please enter correct password";
	
	public PaswordIncorrect() {
		super();
	}
	public PaswordIncorrect(String message) {
		super();
		this.message=message;
	}

}
