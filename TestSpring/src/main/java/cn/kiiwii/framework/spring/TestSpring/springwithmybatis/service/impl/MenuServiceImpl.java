package cn.kiiwii.framework.spring.TestSpring.springwithmybatis.service.impl;

import cn.kiiwii.framework.spring.TestSpring.springwithmybatis.dao.MenuDao;
import cn.kiiwii.framework.spring.TestSpring.springwithmybatis.model.Menu;
import cn.kiiwii.framework.spring.TestSpring.springwithmybatis.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("menuService")
public class MenuServiceImpl implements MenuService {
    @Autowired
    private MenuDao menuDao;

    public List<Menu> findMenuByUserId(String userId) {
        return menuDao.findMenuByUserId(userId);
    }

    @Override
    public void deleteMenuById(String menuId) {
        this.menuDao.deleteMenuById(menuId);
        deleteMenuByParentId(menuId);
    }

    @Override
    public void deleteMenuByParentId(String parentId) {
        this.deleteMenuByParentId(parentId);
    }

    @Override
    public List<Menu> queryMenu() {
        return this.menuDao.queryMenu();
    }
}
