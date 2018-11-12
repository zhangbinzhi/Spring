package cn.kiiwii.framework.spring.TestSpring.springwithmybatis.controller;

import cn.kiiwii.framework.spring.TestSpring.springwithmybatis.model.Account;
import cn.kiiwii.framework.spring.TestSpring.springwithmybatis.service.ITestService;
import com.alibaba.fastjson.JSON;
import org.springframework.beans.factory.annotation.Autowired;
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
    private ITestService testService;

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    @ResponseBody
    String login(@RequestParam("userName") String username) {
        List<Account> accountList = this.testService.findAccountsById(3);
        log.info(accountList);
        HashMap<String,Object> map=new HashMap<String, Object>();
        LoginUser user = new LoginUser();
        user.setId(System.currentTimeMillis());
        user.setName("hello:"+username);
        map.put("status","success");
        map.put("user",user);
        map.put("tst","test");
        return JSON.toJSONString(map);
    }

    private class LoginUser {
        private Long id;
        private String name;

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }
}
