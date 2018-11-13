package cn.kiiwii.framework.spring.TestSpring.springwithmybatis.model;

public class Menu {
    private String menuId;
    private String parentId;
    private String menuName;
    private int menuLevel;
    private String href;
    private String icon;
    private String sort;
    private int isShow;
    private String permission;
    private String remark;
    private String menuStyle;

    public Menu() {
        super();
    }

    @Override
    public String toString() {
        return "Menu{" +
                "menuId='" + menuId + '\'' +
                ", parentId='" + parentId + '\'' +
                ", menuName='" + menuName + '\'' +
                ", menuLevel=" + menuLevel +
                ", href='" + href + '\'' +
                ", icon='" + icon + '\'' +
                ", sort='" + sort + '\'' +
                ", isShow=" + isShow +
                ", permission='" + permission + '\'' +
                ", remark='" + remark + '\'' +
                ", menuStyle='" + menuStyle + '\'' +
                '}';
    }

    public String getMenuId() {
        return menuId;
    }

    public void setMenuId(String menuId) {
        this.menuId = menuId;
    }

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    public String getMenuName() {
        return menuName;
    }

    public void setMenuName(String menuName) {
        this.menuName = menuName;
    }

    public int getMenuLevel() {
        return menuLevel;
    }

    public void setMenuLevel(int menuLevel) {
        this.menuLevel = menuLevel;
    }

    public String getHref() {
        return href;
    }

    public void setHref(String href) {
        this.href = href;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getSort() {
        return sort;
    }

    public void setSort(String sort) {
        this.sort = sort;
    }

    public int getIsShow() {
        return isShow;
    }

    public void setIsShow(int isShow) {
        this.isShow = isShow;
    }

    public String getPermission() {
        return permission;
    }

    public void setPermission(String permission) {
        this.permission = permission;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getMenuStyle() {
        return menuStyle;
    }

    public void setMenuStyle(String menuStyle) {
        this.menuStyle = menuStyle;
    }
}
