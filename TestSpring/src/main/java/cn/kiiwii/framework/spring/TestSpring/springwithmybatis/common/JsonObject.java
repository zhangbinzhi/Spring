package cn.kiiwii.framework.spring.TestSpring.springwithmybatis.common;

import com.alibaba.fastjson.JSON;

import java.util.HashMap;

public class JsonObject {
    private HashMap<String, Object> map =new HashMap<String, Object>();

    public JsonObject() {
        super();
    }

    public JsonObject put(String key, Object value) {
        map.put(key, value);
        return this;
    }

    public JsonObject remove(String key) {
        map.remove(key);
        return this;
    }

    public Object toJson() {
        return JSON.toJSON(map);
    }

    public static JsonObject getInstance(){
        return new JsonObject();
    }

    public static JsonObject getSuccessJson() {
        return new JsonObject().put("status", "success");
    }

    public static JsonObject getSuccessJson(String msg) {
        return new JsonObject().put("status", "success").put("msg", msg);
    }

    public static JsonObject getFailJson() {
        return new JsonObject().put("status", "fail");
    }

    public static JsonObject getFailJson(String msg) {
        return new JsonObject().put("status", "fail").put("msg", msg);
    }
}
