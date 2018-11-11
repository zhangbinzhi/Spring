package cn.kiiwii.framework.spring.TestSpring.springwithmybatis.controller;

import cn.kiiwii.framework.spring.TestSpring.springwithmybatis.model.Account;
import cn.kiiwii.framework.spring.TestSpring.springwithmybatis.service.ITestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

@Controller
@RequestMapping("/user")
public class UserController extends BasicController {
    @Autowired
    private ITestService testService;

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public void list(HttpServletRequest request, HttpServletResponse response) {
        List<Account> accountList = this.testService.findAccountsById(3);
        log.info(accountList);
//        response.

    }
}
