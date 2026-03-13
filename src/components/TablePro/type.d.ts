import { type CellStyle } from 'element-plus';

export type IOption<T = string | number> = {
  /**
   * 标签
   */
  label?: string;
  /**
   * 取值
   */
  value?: T;
  /**
   * 标签
   */
  name?: string;
  /**
   * 取值
   */
  code?: T;
  /**
   * primary | success | danger | warning | info
   */
  type?: string;
  /**
   * 禁用
   */
  disabled?: boolean;
  /**
   * 子集
   */
  children?: IOption<T>[];
};

/**
 * 请求配置
 */
export interface TableRequestConfig {
  /**
   * 是否立即发起请求
   */
  immediately?: boolean;
  /**
   * 额定请求参数
   */
  params?: Recordable;
  /**
   * 接口前缀
   */
  baseUrl?: string;
  /**
   * 列表请求接口url
   */
  url?: string;
  /**
   * 请求方式
   */
  method?: 'get' | 'GET' | 'post' | 'POST';
}

/**
 * 搜索栏配置
 */
export interface ISearchConfig<T = Recordable> {
  /**
   * 搜索表单项
   */
  formItems?: Array<ISearchFormItem<T>>;
  /**
   * 几列排布
   */
  col?: number;
  /**
   * 查询按钮文字
   * @default 查询
   */
  searchText?: string;
  /**
   * 重置按钮文字
   * @default 查询
   */
  resetText?: string;
  /**
   * 搜索项label宽度
   * @default 'auto'
   */
  labelWidth?: string | number;
  /**
   * 搜索栏className
   */
  className?: string;
  /**
   * 是否展示展开/收起按钮
   * @default true
   */
  isExpandable?: boolean;
  /**
   * 展示/收起
   * @default true
   */
  isExpand?: boolean;
}

/**
 *  表单项
 */
export interface ISearchFormItem<T extends Recordable> {
  /**
   * 自定义插槽
   */
  slotName?: string;
  /**
   * 占几列
   * @default 1
   */
  span?: number;
  /**
   * 组件类型
   */
  type?:
    | 'text'
    | 'select-text'
    | 'input-number'
    | 'number-range'
    | 'checkbox'
    | 'radio'
    | 'select'
    | 'cascader'
    | 'date-picker'
    | 'date-range';
  /**
   * 标签文本
   */
  label?: string;
  /**
   * 标签提示
   */
  tip?: string;
  /**
   * 属性字段
   */
  prop?: keyof T;
  /**
   * 初始值
   */
  initialValue?: any;
  /**
   * 验证规则
   */
  rules?: FormItemRule | FormItemRule[];
  /**
   * 组件属性
   */
  attrs?: ISelectAttrs | ICascaderAttrs | IDateAttrs | IRadioAttrs | IFormAttrs;
  /**
   * 转换值
   */
  transform?: (value: any, params: T) => void;
}

/**
 * 筛选项通用属性
 */
export interface IFormAttrs extends Recordable {
  /**
   * 是否可以清空选项
   * @default true
   */
  clearable?: boolean;
  /**
   * 尺寸
   * @default 'default'
   */
  size?: 'small' | 'default' | 'large';
  /**
   * 占位符
   * @default '请输入 | 请选择'
   */
  placeholder?: string;
  /**
   * 禁用
   * @default false
   */
  disabled?: boolean;
}

/**
 * 下拉选择器属性
 */
export interface ISelectAttrs extends IFormAttrs {
  /**
   * 隐藏全部选项，multiple为true时自动隐藏
   * @default false
   */
  hideAll?: boolean;
  /**
   * 是否多选
   * @default false
   */
  multiple?: boolean;
  /**
   * multiple 属性设置为 true 时，代表多选场景下用户最多可以选择的项目数， 为 0 则不限制
   */
  multipleLimit?: number;
  /**
   * 多选时是否将选中值按文字的形式展示
   * @default false
   */
  collapseTags?: boolean;
  /**
   * 当鼠标悬停于折叠标签的文本时，是否显示所有选中的标签。 要使用此属性，collapse-tags属性必须设定为 true
   * @default false
   */
  collapseTagsTooltip?: boolean;
  /**
   * 需要显示的 Tag 的最大数量 只有当 collapse-tags 设置为 true 时才会生效。
   * @default 1
   */
  maxCollapseTags?: number;
  /**
   * 是否可筛选
   */
  filterable?: boolean;
  /**
   * 列表数据
   */
  options?: IOption[];
  /**
   * 列表数据远程请求
   */
  request?: () => Promise<IOption[]>;
}

/**
 * 级联选择器属性
 */
export interface ICascaderAttrs extends IFormAttrs {
  /**
   * 指定选项标签为选项对象的某个属性值
   * @default label
   */
  label?: string;
  /**
   * 指定选项的值为选项对象的某个属性值
   * @default value
   */
  value?: string;
  /**
   * 	指定选项的子选项为选项对象的某个属性值
   * @default children
   */
  children?: string;
  /**
   * 输入框中是否显示选中值的完整路径
   * @default true
   */
  showAllLevels?: boolean;
  /**
   * 用于分隔选项的字符
   */
  separator?: string;
  /**
   * 在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值
   * @default true
   */
  emitPath?: boolean;
  /**
   * 是否严格的遵守父子节点不互相关联
   * @default false
   */
  checkStrictly?: boolean;
  /**
   * 是否多选
   * @default false
   */
  multiple?: boolean;
  /**
   * multiple 属性设置为 true 时，代表多选场景下用户最多可以选择的项目数， 为 0 则不限制
   */
  multipleLimit?: number;
  /**
   * 多选时是否将选中值按文字的形式展示
   * @default false
   */
  collapseTags?: boolean;
  /**
   * 当鼠标悬停于折叠标签的文本时，是否显示所有选中的标签。 要使用此属性，collapse-tags属性必须设定为 true
   * @default false
   */
  collapseTagsTooltip?: boolean;
  /**
   * 需要显示的 Tag 的最大数量 只有当 collapse-tags 设置为 true 时才会生效。
   * @default 1
   */
  maxCollapseTags?: number;
  /**
   * 是否可筛选
   */
  filterable?: boolean;
  /**
   * 列表数据
   */
  options?: IOption[];
  /**
   * 列表数据远程请求
   */
  request?: () => Promise<IOption[]>;
}

/**
 *  时间选择器属性
 */
export interface IDateAttrs extends IFormAttrs {
  /**
   *  绑定值的格式
   * @default 'YYYY-MM-DD HH:mm:ss'
   */
  valueFormat?: string;
  /**
   * 文本框可输入
   * @default true
   */
  editable?: boolean;
}

/**
 *  单选框属性
 */
export interface IRadioAttrs extends IFormAttrs {
  /**
   * 列表数据
   */
  options?: IOption[];
  /**
   * 列表数据远程请求
   */
  request?: () => Promise<IOption[]>;
}

/**
 *  多选框属性
 */
export interface ICheckboxAttrs extends IFormAttrs {
  /**
   * 列表数据
   */
  options?: IOption[];
  /**
   * 列表数据远程请求
   */
  request?: () => Promise<IOption[]>;
}

/**
 * 工具栏配置
 */
export interface IToolbarConfig {
  /**
   * 表格标题
   */
  title?: string;
  /**
   * 表格设置工具
   */
  defaultToolbar?: Array<'refresh' | 'filter'>;
  /**
   * 导入请求url
   */
  importUrl?: string;
  /**
   * 导入模板
   */
  importTemplate?: string;
  /**
   * 导出请求url
   */
  exportUrl?: string;
}

/**
 * 表格配置
 */
export interface ITableConfig<T extends Recordable> {
  /**
   * 表格className
   */
  className?: string;
  /**
   * 表格列数据
   */
  columns: TableColumn<T>[];
  /**
   * 自定义列表数据
   */
  dataSource?: T[];
  /**
   * 空数据时显示的文本内容
   * @default 暂无数据
   */
  emptyText?: string;
  /**
   * 单元格空数据时显示的文本内容，会被columns.emptyText覆盖
   */
  cellEmptyText?: string;
  /**
   * 行数据的 Key
   * @default id
   */
  rowKey?: string;
  /**
   * 列的宽度是否自撑开
   * @default true
   */
  fit?: boolean;
  /**
   * 是否显示表头
   * @default true
   */
  showHeader?: boolean;
  /**
   * 表头单元格的 style
   */
  headerCellStyle?: CellStyle;
  /**
   * 是否带有纵向边框
   * @default false
   */
  border?: boolean;
  /**
   * 是否要高亮当前行
   * @default false
   */
  highlightCurrentRow?: boolean;
  /**
   * 是否为斑马纹 table
   * @default false
   */
  stripe?: boolean;
  /**
   * 是否展示序号
   * @default false
   */
  showIndex?: boolean;
  /**
   * 是否开启列表勾选
   * @default false
   */
  multiple?: boolean;
  /**
   * 勾选启用逻辑 true允许勾选 false禁止勾选
   * @default 默认全部行可勾选
   */
  selectable?: (row: T, index: number) => boolean;
  /**
   * 数据刷新后是否保留选项，仅对  type=selection 的列有效， 请注意， 需指定 row-key 来让这个功能生效
   * @default false
   */
  reserveSelection?: boolean;
}

/**
 * 列表
 */
export interface TableColumn<T extends Recordable> {
  /**
   * 自定义插槽
   */
  slotName?: string;
  /**
   * 字段名称 对应列内容的字段名
   */
  prop?: keyof T;
  /**
   * 显示的标题
   */
  label?: string;
  /**
   * 标题旁 ? 提示文案
   */
  tip?: string;
  /**
   * 空值占位文字
   */
  emptyText?: string;
  /**
   * 对应列的宽度
   */
  width?: string | number;
  /**
   * 是否支持复制
   */
  copyable?: boolean;
  /**
   * 列是否固定在左侧或者右侧。 true 表示固定在左侧
   */
  fixed?: boolean | 'left' | 'right';
  /**
   * 对齐方式
   * @default 'left'
   */
  align?: 'left' | 'center' | 'right';
  /**
   * 表头对齐方式
   * @default 'left'
   */
  headerAlign?: 'left' | 'center' | 'right';
  /**
   * 当内容过长被隐藏时显示 tooltip
   */
  showOverflowTooltip?: boolean;
  /**
   * 对应列是否可以通过拖动改变宽度（需要在 el-table 上设置 border 属性为真）
   * @default true
   */
  resizable?: boolean;
  /**
   * 当前列标题的自定义类名
   */
  labelClassName?: string;
  /**
   * 列的 className
   */
  className?: string;
  /**
   * 格式化内容
   */
  formatter?: (row: T, column: any, cellValue: any, index: number) => VNode | string;
  /**
   * 自定义枚举
   */
  enum?: IOption[];
  /**
   * column 的 key， column 的 key， 如果需要使用 filter-change 事件，则需要此属性标识是哪个 column 的筛选条件
   */
  columnKey?: string;
  /**
   * 对应列是否可以排序
   */
  sortable?: boolean | string;
  /**
   * 指定数据按照哪个属性进行排序，仅当 sortable 设置为 true 且没有设置 sort-method 的时候有效
   */
  sortBy?: string | ((row: T, index: number) => string) | string[];
  /**
   * 指定数据按照哪个属性进行排序，仅当sortable设置为true的时候有效
   */
  sortMethod?: (a: T, b: T) => number;
  /**
   * 如果tableConfig设置了 showIndex=true，可以通过传递 index 属性来自定义索引
   */
  index?: number | ((index: number) => number);
  /**
   * 子列表
   */
  children?: TableColumn<T>[];
}

/**
 * 分页栏配置
 */
export type IPaginationConfig = {
  /**
   * 每页条数
   * @default 20
   */
  pageSize?: number;
  /** 分页条数选项 */
  pageSizes?: number[];
  /** 列表总数 */
  total?: number;
  /**
   * 分页组件
   * @default 'total, sizes, prev, pager, next'
   */
  layout?: string;
} | null;
