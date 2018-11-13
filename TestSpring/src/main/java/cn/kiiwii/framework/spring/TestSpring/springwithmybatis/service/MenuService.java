package cn.kiiwii.framework.spring.TestSpring.springwithmybatis.service;

import cn.kiiwii.framework.spring.TestSpring.springwithmybatis.model.Menu;

import java.util.List;

public interface MenuService {
    List<Menu> findMenuByUserId(String userId);

    void deleteMenuById(String menuId);

    void deleteMenuByParentId(String parentId);
}
