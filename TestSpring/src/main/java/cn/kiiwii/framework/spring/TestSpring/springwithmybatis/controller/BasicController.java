package cn.kiiwii.framework.spring.TestSpring.springwithmybatis.controller;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class BasicController {
    Logger log = Logger.getLogger(BasicController.class);
}
