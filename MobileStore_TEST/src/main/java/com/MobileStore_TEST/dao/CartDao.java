package com.MobileStore_TEST.dao;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.MobileStore_TEST.entity.Cart;
import com.MobileStore_TEST.entity.User;

public interface CartDao extends CrudRepository<Cart, Integer>
{
	public List<Cart> findByUser(User user);

}
