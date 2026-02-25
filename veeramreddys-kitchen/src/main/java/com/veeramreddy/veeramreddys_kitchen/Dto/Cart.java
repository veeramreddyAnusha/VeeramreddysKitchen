package com.veeramreddy.veeramreddys_kitchen.Dto;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.Data;

@Entity
@Data
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cartId;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private App_User user;

    @OneToMany(
        mappedBy = "cart",
        cascade = CascadeType.ALL,
        fetch = FetchType.LAZY
    )
    @JsonManagedReference
    private List<CartItem> items;
    
    
}
