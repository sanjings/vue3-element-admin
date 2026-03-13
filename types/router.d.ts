import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * 设置该路由在侧边栏和面包屑中展示的名字
     */
    title?: string;
    /**
     * 设置该路由的图标，直接使用 Element Plus 的 Icon
     */
    icon?: string;
    /**
     * 默认 false，设置 true 的时候该路由不会在侧边栏出现
     */
    hideInMenu?: boolean;
    /**
     * 示例: activeMenu: "/xxx/xxx"，
     * 当设置了该属性进入路由时，则会高亮 activeMenu 属性对应的侧边栏。
     * 该属性适合使用在有 hideInMenu: true 属性的路由上
     */
    activeMenu?: string;
    /**
     * 默认 false，设置 true 的时候该路由不会在页签上出现
     */
    hideInTagview?: boolean;
    /**
     * 是否固定在页签上
     * true 固定, false 不固定
     * @default false
     */
    affix?: boolean;
    /**
     * 是否缓存该路由页面
     * 默认为 false，为 true 时代表需要缓存，此时该路由和该页面都需要设置一致的 Name
     */
    keepAlive?: boolean;
    /**
     * 是否为动态加载路由
     */
    dynamic?: boolean;
  }
}
