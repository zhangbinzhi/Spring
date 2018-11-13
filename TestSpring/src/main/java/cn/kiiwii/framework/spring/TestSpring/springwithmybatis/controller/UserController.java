package cn.kiiwii.framework.spring.TestSpring.springwithmybatis.controller;

import cn.kiiwii.framework.spring.TestSpring.springwithmybatis.common.JsonObject;
import cn.kiiwii.framework.spring.TestSpring.springwithmybatis.model.Account;
import cn.kiiwii.framework.spring.TestSpring.springwithmybatis.model.CommonUser;
import cn.kiiwii.framework.spring.TestSpring.springwithmybatis.model.LoginUser;
import cn.kiiwii.framework.spring.TestSpring.springwithmybatis.service.ITestService;
import cn.kiiwii.framework.spring.TestSpring.springwithmybatis.service.MenuService;
import cn.kiiwii.framework.spring.TestSpring.springwithmybatis.service.UserService;
import com.alibaba.fastjson.JSON;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.List;

@Controller
@RequestMapping("/user")
public class UserController extends BasicController {
    @Autowired
    private UserService userService;

    @Autowired
    private MenuService menuService;

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    @ResponseBody
    Object login(LoginUser user) {
        List<CommonUser> userList = this.userService.findUserByUsername(user.getUsername());
        if (userList.size() < 1) {
            return JsonObject.getFailJson("用户不存在！").toJson();
        } else {
            CommonUser dbUser = userList.get(0);
            dbUser.setLoginPwd(user.getPassword());
            if (dbUser.checkLoginPwd()) {
                return JsonObject.getSuccessJson("登录成功")
                        .put("menuList", menuService.findMenuByUserId(dbUser.getUserId()))
                        .put("userInfo",JsonObject.getInstance().put("username",dbUser.getUsername()).put("userId",dbUser.getUserId()).toJson())
                        .toJson();
            } else {
                return JsonObject.getFailJson("用户密码错误！").toJson();
            }
        }
    }
}
