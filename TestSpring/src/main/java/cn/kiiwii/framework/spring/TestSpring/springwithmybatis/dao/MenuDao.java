package cn.kiiwii.framework.spring.TestSpring.springwithmybatis.dao;

import cn.kiiwii.framework.spring.TestSpring.springwithmybatis.model.Menu;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface MenuDao {
    @Select("SELECT  DISTINCT a.parentId,a.menuId,a.icon,a.menuName,a.href,a.menuStyle,a.sort FROM param_menu a \n" +
            "JOIN param_role_menu rm ON a.menuId = rm.menuId \n" +
            "JOIN param_role_user ru ON rm.roleId = ru.roleId\n" +
            "WHERE a.isShow >0 AND ru.userId =#{userId} ORDER BY a.sort")
    List<Menu> findMenuByUserId(String userId);

    @Delete("delete from param_menu where menuid = #{menuId}")
    void deleteMenuById(String menuId);

    @Delete("delete from param_menu where parentId = #{parentId}")
    void deleteMenuByParentId(String parentId);
}
