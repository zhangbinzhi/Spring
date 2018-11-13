package cn.kiiwii.framework.spring.TestSpring.springwithmybatis.dao;

import cn.kiiwii.framework.spring.TestSpring.springwithmybatis.model.CommonUser;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface UserDao {
    @Select("select userId,username,userPwd as dbPdw from param_user where userId = #{id} ")
    List<CommonUser> findUserById(String id);

    @Select("select userId,username,userPwd as dbPdw from param_user where username = #{username} ")
    List<CommonUser> findUserByUsername(String username);
}
