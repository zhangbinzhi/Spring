package cn.kiiwii.framework.spring.TestSpring.springwithmybatis.controller;

import cn.kiiwii.framework.spring.TestSpring.springwithmybatis.common.JsonObject;
import cn.kiiwii.framework.spring.TestSpring.springwithmybatis.model.Menu;
import cn.kiiwii.framework.spring.TestSpring.springwithmybatis.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/office")
public class MenuController {
    @Autowired
    private MenuService menuService;

    @RequestMapping(value = "/queryMenu", method = RequestMethod.GET)
    @ResponseBody
    Object queryMenu() {
        return JsonObject.getSuccessJson().put("items", this.menuService.queryMenu()).toJson();
    }

    @RequestMapping(value = "/editMenu", method = RequestMethod.GET)
    @ResponseBody
    Object editMenu(Menu menu) {
        return JsonObject.getSuccessJson("操作成功").toJson();
    }

    @RequestMapping(value = "/deleteMenu", method = RequestMethod.GET)
    @ResponseBody
    Object deleteMenu(@RequestParam("menuId") String menuId) {
        this.menuService.deleteMenuById(menuId);
        return JsonObject.getSuccessJson("操作成功").toJson();
    }

    @RequestMapping(value = "/addMenu", method = RequestMethod.GET)
    @ResponseBody
    Object addMenu(Menu menu) {
//        this.menuService.deleteMenuById(menuId);
        return JsonObject.getSuccessJson("操作成功").toJson();
    }
}
