package com.rainbow.controller;

import com.rainbow.beans.OpenstackConnection;
import com.rainbow.openstack.services.AuthService;

public class TestRESTApi {

	public static void main(String[] args) {
		try{
		AuthService authentication = new AuthService();
		
		OpenstackConnection conn = new OpenstackConnection();
		conn.setServer("10.0.0.11");
		conn.setUsername("admin");
		conn.setPassword("admin_user_secret");
		 
		
		} catch(Exception ex) {
			
		}
	}
}
