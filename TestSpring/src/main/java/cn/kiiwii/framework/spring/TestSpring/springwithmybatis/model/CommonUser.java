package cn.kiiwii.framework.spring.TestSpring.springwithmybatis.model;

import org.apache.commons.codec.digest.DigestUtils;

public class CommonUser {
    private String userId;
    private String username;
    private String loginPwd;
    private String dbPdw;

    public Boolean checkLoginPwd() {
        if (loginPwd == null) {
            return false;
        }
        String encodePwd = DigestUtils.md5Hex(loginPwd);
        return encodePwd.equals(dbPdw);
    }

    public CommonUser() {
        super();
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getLoginPwd() {
        return loginPwd;
    }

    public void setLoginPwd(String loginPwd) {
        this.loginPwd = loginPwd;
    }

    public String getDbPdw() {
        return dbPdw;
    }

    public void setDbPdw(String dbPdw) {
        this.dbPdw = dbPdw;
    }
}
