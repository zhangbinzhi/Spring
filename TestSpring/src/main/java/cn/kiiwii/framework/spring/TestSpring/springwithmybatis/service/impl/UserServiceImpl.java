package cn.kiiwii.framework.spring.TestSpring.springwithmybatis.service.impl;

import cn.kiiwii.framework.spring.TestSpring.springwithmybatis.dao.UserDao;
import cn.kiiwii.framework.spring.TestSpring.springwithmybatis.model.CommonUser;
import cn.kiiwii.framework.spring.TestSpring.springwithmybatis.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("userService")
public class UserServiceImpl implements UserService {
    @Autowired
    private UserDao userDao;

    public List<CommonUser> findUserByUsername(String username) {
        return this.userDao.findUserByUsername(username);
    }

    public List<CommonUser> findUserByUserId(String id) {
        return this.findUserByUserId(id);
    }
}
