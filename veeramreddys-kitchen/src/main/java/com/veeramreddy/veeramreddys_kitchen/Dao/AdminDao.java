package com.veeramreddy.veeramreddys_kitchen.Dao;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.veeramreddy.veeramreddys_kitchen.Dto.Admin;
import com.veeramreddy.veeramreddys_kitchen.Dto.App_User;
import com.veeramreddy.veeramreddys_kitchen.Repo.AdminRepo;

@Repository
public class AdminDao {
	
	@Autowired
	private AdminRepo repo;
	
	
	public Admin SaveAdmin(Admin admin) {
		return repo.save(admin);
		
	}

//	-------------------------------------------------------------------------------------------
	
	public Admin DeleteAdmin(Long adminId) {
		 Optional<Admin> Adminrepo = repo.findById(adminId);
	        if (Adminrepo.isPresent()) {
	            Admin admin = Adminrepo.get();
	            repo.delete(admin);
	            return admin;
	        }
	        return null;
		
	}
	
//	---------------------------------------------------------------------------------------------
	
	public Admin getAdminByEmail(String email) {
		Admin admin=repo.findByEmail(email);
		if(admin !=null) {
			return admin;
			
		} else
		return null;
	}
	
	
//	----------------------------------------------------------------------------------------------
	

	public Admin getAdminById(long adminId) {
		 if (repo.findById((long) adminId).isPresent()) {
			   Admin admin=repo.findById(adminId).get();
			   return admin;
		   }
		   
		return null;
	}
	
//	-------------------------------------------------------------------------------------------

	public Admin AdminUpdate(Admin admin) {
		Admin ad=repo.findById(admin.getAdminId()).get();
		if(ad !=null) {
			if(admin.getName()==null) {
				admin.setName(ad.getName());
			}
		}
		if(ad !=null) {
			if(admin.getEmail() ==null) {
				admin.setEmail(ad.getEmail());
			}
		}
		if(ad !=null) {
			if(admin.getPassword()==null) {
				admin.setPassword(ad.getPassword());
			}
		}
		if(ad !=null) {
			if(admin.getAddress()==null) {
				admin.setAddress(ad.getAddress());
			}
		}
		if(ad !=null) {
			if(admin.getPhone()==null) {
				admin.setPhone(ad.getPhone());
			}
		
		
			repo.save(admin);
			return admin;
			
		}
		
		return null;
	}

//	---------------------------------------------------------------------------------------------
	 public List<Admin> getAllAdmins(){
			return repo.findAll();
			   
		   }
	
//	---------------------------------------------------------------------------------------------
	
}
