package com.veeramreddy.veeramreddys_kitchen.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.veeramreddy.veeramreddys_kitchen.Dao.AdminDao;
import com.veeramreddy.veeramreddys_kitchen.Dto.Admin;
import com.veeramreddy.veeramreddys_kitchen.Dto.App_User;
import com.veeramreddy.veeramreddys_kitchen.Exception.EmailNotFound;
import com.veeramreddy.veeramreddys_kitchen.Exception.NoSuchElementFoundException;
import com.veeramreddy.veeramreddys_kitchen.Exception.PaswordIncorrect;
import com.veeramreddy.veeramreddys_kitchen.Repo.AdminRepo;
import com.veeramreddy.veeramreddys_kitchen.Util.ResponseStructure;

@Service
public class AdminService {
	
	@Autowired
	private AdminDao dao;
	
	@Autowired
	private AdminRepo repo;

	public ResponseEntity<ResponseStructure<Admin>> SaveAdmin(Admin admin) {
		
		if (repo.existsByEmail(admin.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (repo.existsByPhone(admin.getPhone())) {
            throw new RuntimeException("Phone number already exists");
        }
		
		Admin SaveAdmin =dao.SaveAdmin(admin);
		
		ResponseStructure<Admin> structure= new ResponseStructure<Admin>();
		structure.setStatus(HttpStatus.CREATED.value());
		structure.setData(SaveAdmin);
		structure.setMessage("Admin account created successfully");
		
		return new ResponseEntity<ResponseStructure<Admin>>(structure,HttpStatus.CREATED);
	}
	
//	------------------------------------------------------------------------------------------

	public ResponseEntity<ResponseStructure<Admin>> DeleteAdmin(long adminId) {
		 Admin db = dao.DeleteAdmin(adminId);

	        if (db != null) {
	            ResponseStructure<Admin> structure = new ResponseStructure<>();
	            structure.setMessage("Deleted successfully");
	            structure.setStatus(HttpStatus.OK.value());
	            structure.setData(db);
	            return new ResponseEntity<>(structure, HttpStatus.OK);
	        } else {
	            throw new NoSuchElementFoundException("Admin ID not found in the database.");
	        }
	}
	
	
//	----------------------------------------------------------------------------------------------------
	

	public ResponseEntity<ResponseStructure<Admin>> AdminLogin(String email, String password) {
		Admin admin=dao.getAdminByEmail(email);
		if(admin !=null) {
			if(admin.getPassword().equals(password)) {
				ResponseStructure<Admin> structure=new ResponseStructure<Admin>();
				structure.setData(admin);
				structure.setStatus(HttpStatus.FOUND.value());
				structure.setMessage("Successfully Login Completed");
				
				return new ResponseEntity<ResponseStructure<Admin>>(structure,HttpStatus.FOUND);
			}
			else {
				throw new PaswordIncorrect();
			}
			
		}else {
			throw new EmailNotFound();
		}
		
	}

//	-----------------------------------------------------------------------------------------------------
	
	public ResponseEntity<ResponseStructure<Admin>> AdminUpdate(Admin admin) {
ResponseStructure<Admin> structure =new ResponseStructure<Admin>();
		
		Admin ad=dao.getAdminById(admin.getAdminId());
		if(ad !=null) {
			structure.setData((dao.AdminUpdate(admin)));
			structure.setMessage("Admin updated Successfully");
			structure.setStatus((HttpStatus.FOUND.value()));
			
			return new ResponseEntity<ResponseStructure<Admin>>(structure,HttpStatus.FOUND);
			
		}
		else throw new NoSuchElementFoundException("Admin not foun on this user id"+admin.getAdminId());
	}
	
	
//	------------------------------------------------------------------------------------------------------

	public ResponseEntity<ResponseStructure<Admin>> getAdminById(long adminId) {
		Admin admin=dao.getAdminById(adminId);
		ResponseStructure<Admin> structure=new ResponseStructure<Admin>();
		if(admin !=null) {
			structure.setData(admin);
			structure.setStatus(HttpStatus.FOUND.value());
			structure.setMessage("Admin found");
			
			return new ResponseEntity<ResponseStructure<Admin>>(structure,HttpStatus.FOUND);
			}
		else {
			throw new NoSuchElementFoundException("no User found for the particular id " +adminId);
		}
	}
	
	
//	--------------------------------------------------------------------------------------------------

	public ResponseEntity<ResponseStructure<List<Admin>>> getAllAdmins() {
  ResponseStructure<List<Admin>> structure=new ResponseStructure<List<Admin>>();
		
  List<Admin> admin=dao.getAllAdmins();
	if(admin !=null) {
		structure.setData(dao.getAllAdmins());
		structure.setStatus(HttpStatus.FOUND.value());
		structure.setMessage("All admins are getting");
			return new ResponseEntity<ResponseStructure<List<Admin>>>(structure,HttpStatus.FOUND);
		}
		else throw new NoSuchElementFoundException("No data is there in the database");
	}
	

//	--------------------------------------------------------------------------------------------------
	
}
