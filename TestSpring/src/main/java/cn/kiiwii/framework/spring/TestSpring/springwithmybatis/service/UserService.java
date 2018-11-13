package cn.kiiwii.framework.spring.TestSpring.springwithmybatis.service;


import cn.kiiwii.framework.spring.TestSpring.springwithmybatis.model.CommonUser;

import java.util.List;

public interface UserService {
    List<CommonUser> findUserByUsername(String username);

    List<CommonUser> findUserByUserId(String id);
}
