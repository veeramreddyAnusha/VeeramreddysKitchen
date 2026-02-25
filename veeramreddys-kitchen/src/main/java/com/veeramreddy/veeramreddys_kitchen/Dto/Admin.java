package com.veeramreddy.veeramreddys_kitchen.Dto;


import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.PrePersist;

import lombok.Data;

@Entity
@Data
public class Admin {

@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long adminId;
private String name;

@Column(unique = true, nullable = false)
private String email;
private String address;

@Column(unique = true, nullable = false)
private Long phone;
private String password;

private Boolean isActive = true;

private LocalDateTime createdAt;

@PrePersist
public void setCreationTime() {
    this.createdAt = LocalDateTime.now();
}

}
