package com.veeramreddy.veeramreddys_kitchen.Exception;

import lombok.Data;

@Data
public class NoSuchElementFoundException extends RuntimeException{
	private String message="No serach element found";
	
	public NoSuchElementFoundException (String msg) {
		super();
		this.message=msg;
		
		
	}

	public NoSuchElementFoundException() {
		super();
	}
}
