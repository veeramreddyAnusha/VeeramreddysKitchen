package com.veeramreddy.veeramreddys_kitchen.Dto;

import javax.persistence.*;

import org.hibernate.annotations.Type;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

@Entity
@Data
public class FoodItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long foodId;

    private String name;
    private String quantity;
    private Double price;
    
    @Lob
    @Type(type = "org.hibernate.type.BinaryType")
    @Column(name = "image", nullable = false)
    private byte[] image;


    @ManyToOne
    @JoinColumn(name = "admin_id")
    private Admin admin;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = true)
    private Category category;

}
