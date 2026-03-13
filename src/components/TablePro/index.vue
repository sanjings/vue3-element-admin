<script lang="ts" setup generic="T extends Recordable = Recordable, P extends Recordable = Recordable">
  import * as components from './FormItems/index';
  import { type ElTable, type FormInstance } from 'element-plus';
  import { cloneDeep } from 'lodash-es';
  import variables from '@/styles/variables.module.scss';
  import { requestDownFile, requestGet, requestPost } from '@/services/util';
  import type { TableRequestConfig, ISearchConfig, IToolbarConfig, ITableConfig, IPaginationConfig } from './type';
  import type { PageListResponse } from 'types/api';

  defineOptions({
    name: 'TablePro',
    components: components
  });

  const props = defineProps<{
    /** 查询请求配置 */
    requests?: TableRequestConfig<P>;
    /** 搜索栏配置 */
    searchConfig?: ISearchConfig<P>;
    /** 工具栏配置 */
    toolbarConfig?: IToolbarConfig;
    /** 表格配置 */
    tableConfig?: ITableConfig<T>;
    /** 分页配置 */
    pagination?: IPaginationConfig;
  }>();

  const requests = reactive({
    immediately: true,
    params: {},
    baseUrl: import.meta.env.VITE_HTTP_BASE_URL,
    method: 'POST',
    ...props.requests
  });

  const searchConfig = reactive({
    formItems: [],
    searchText: '查询',
    resetText: '重置',
    isExpandable: true,
    isExpand: true,
    ...props.searchConfig
  });

  const toolbarConfig = reactive({
    ...props.toolbarConfig
  });

  const tableConfig = reactive({
    columns: [],
    dataSource: [],
    emptyText: '暂无数据',
    rowKey: 'id',
    showHeader: true,
    fit: true,
    selectable: () => true,
    ...props.tableConfig
  });

  const pagination = reactive({
    pageSize: window.innerHeight > 1200 ? 30 : 20,
    pageSizes: [10, 20, 30, 50, 100],
    total: 0,
    layout: 'total, sizes, prev, pager, next',
    ...props.pagination
  });

  const $emit = defineEmits([
    'onClickSearch',
    'onSearch',
    'onDataLoad',
    'onRequestError',
    'onSelect',
    'onMultipleSelect',
    'onSortChange'
  ]);
  const $slots = useSlots();

  const loading = ref(false);
  const queryParams = ref<P>({} as P);
  const pageRef = useTemplateRef<HTMLElement>('page');
  const tableRef = useTemplateRef<InstanceType<typeof ElTable>>('table');
  const searchFormRef = useTemplateRef<FormInstance>('searchForm');
  // 窗口宽度响应式处理
  const windowWidth = ref(window.innerWidth);
  const updateWindowWidth = () => {
    windowWidth.value = window.innerWidth;
  };

  onMounted(() => {
    window.addEventListener('resize', updateWindowWidth);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateWindowWidth);
  });

  const searchcolnum = computed(
    () =>
      searchConfig?.col ||
      Math.round(
        (pageRef.value?.offsetWidth || Number(windowWidth.value - parseFloat(variables['sidebar-width']))) / 445
      ) ||
      4
  );
  const searchItems = computed(() => {
    if (!searchConfig.isExpandable) return searchConfig.formItems;
    return searchConfig.formItems.slice(0, searchConfig.isExpand ? searchConfig.formItems.length : searchcolnum.value);
  });
  const tableData = ref<T[]>((tableConfig.dataSource as T[] | undefined) || []);
  const tableTotal = ref(pagination?.total);
  const pageParams = reactive({
    page: 1,
    pageSize: pagination.pageSize
  });
  const selectedRows = ref<Recordable[]>([]);
  const exportLoading = ref(false);

  onMounted(() => {
    _initQueryParams();
    if (requests.immediately) {
      handleSearch();
    }
  });

  /**
   * 初始化查询参数
   */
  const _initQueryParams = () => {
    queryParams.value = cloneDeep(requests.params);
    searchConfig.formItems?.forEach?.((item) => {
      const initialValue = item.initialValue;
      // 只有对象和数组才需要深拷贝
      if (initialValue != undefined) {
        queryParams.value[item.prop] =
          Array.isArray(initialValue) || (typeof initialValue === 'object' && initialValue !== null)
            ? cloneDeep(initialValue)
            : initialValue;
        item.transform?.(initialValue, queryParams.value);
      } else if (item.type === 'number-range' || item.type === 'select-text') {
        queryParams.value[item.prop] = [];
      }
    });
  };

  /**
   * 修改查询参数
   */
  const changeQueryParams = (params: Recordable) => {
    queryParams.value = cloneDeep({ ...queryParams.value, ...params });
  };

  /**
   * 展开/收起筛选栏
   */
  const handleCollapseExpand = () => {
    searchConfig.isExpand = !searchConfig.isExpand;
  };

  /**
   * 查询第一页
   */
  const handleSearch = async () => {
    try {
      await searchFormRef.value?.validate();
      pageParams.page = 1;
      refresh();
      $emit('onClickSearch', { ...queryParams.value });
    } catch (error) {
      // 表单验证失败，不执行查询
      console.warn('表单验证失败:', error);
    }
  };

  /**
   * 重置筛选条件后查询第一页
   */
  const handleReset = () => {
    searchFormRef.value?.clearValidate();
    tableRef.value?.clearSort();
    _initQueryParams();
    handleSearch();
  };

  /**
   * 刷新当前页
   */
  const refresh = () => {
    clearSelection();
    getData();
  };

  /**
   * 清除选项
   */
  const clearSelection = () => {
    tableRef.value?.clearSelection();
  };

  /**
   * 单选
   */
  const handleCurrentChange = (row: Recordable) => {
    $emit('onSelect', row);
  };

  /**
   * 多选
   */
  const handleSelectionChange = (rows: Recordable[]) => {
    selectedRows.value = rows || [];
    $emit('onMultipleSelect', selectedRows.value);
  };

  const handleSortChange = (data: {
    column: any;
    prop: keyof typeof queryParams.value;
    order: 'descending' | 'ascending';
  }) => {
    $emit('onSortChange', data, queryParams.value);
  };

  const getData = () => {
    let params = { ...queryParams.value };
    if (props.pagination !== null) {
      params = {
        ...params,
        ...pageParams
      };
    }
    requests.url && getTableList(params);
    $emit('onSearch', params);
  };

  const getTableList = async (params: Recordable) => {
    try {
      loading.value = true;
      const requestFn = requests?.method?.toLowerCase?.() === 'get' ? requestGet : requestPost;
      const res = await requestFn<PageListResponse<Recordable>>(requests.baseUrl + requests.url, { body: params });

      if (res.code === 200) {
        tableData.value = (Array.isArray(res.data) ? res.data : res.data?.list || []) as T[];
        tableTotal.value = Array.isArray(res.data) ? res.data.length : Number(res.data?.count) || 0;
        $emit('onDataLoad', { tableData: tableData.value, tableTotal: tableTotal.value });
      } else {
        $emit('onRequestError', res);
        tableData.value = [];
        tableTotal.value = 0;
        ElMessage.error(res.message || '请求失败');
      }
    } catch (error: any) {
      // util.ts 中的 handleError 已经处理了取消请求的情况
      $emit('onRequestError', error);
      tableData.value = [];
      tableTotal.value = 0;
      ElMessage.error(error?.message || '请求失败');
    } finally {
      loading.value = false;
    }
  };

  /**
   * 导出
   */
  const handleExport = async (url: string) => {
    exportLoading.value = true;
    try {
      await requestDownFile(`${requests.baseUrl}${url}`, { body: cloneDeep(queryParams.value) });
    } catch (error) {
      ElMessage.error('导出失败!');
    }
    exportLoading.value = false;
  };

  // // 对父组件暴露，通过ref实例调用
  defineExpose({
    search: handleSearch,
    refresh,
    reset: handleReset,
    changeQueryParams,
    collapseExpand: handleCollapseExpand,
    clearSelection,
    tableData,
    tableTotal
  });
</script>

<template>
  <div ref="page" class="table-pro">
    <section v-if="props.searchConfig" class="table-pro__header">
      <el-form
        ref="searchForm"
        inline
        :model="queryParams as P"
        :label-width="searchConfig.labelWidth"
        label-suffix="："
        :class="['table-pro__header--search', searchConfig.className]"
      >
        <template v-for="(item, index) in searchItems" :key="index">
          <slot v-if="item.slotName" :name="item.slotName" :queryParams="queryParams"></slot>
          <el-form-item
            v-else
            :label="item.label"
            :prop="item.prop as string"
            :rules="item.rules"
            :style="{ 'grid-column-start': `span ${item.span || 1}` }"
          >
            <template #label v-if="item.tip">
              <span>
                {{ item.label }}
                <el-tooltip placement="top" :content="item.tip" raw-content>
                  <el-icon style="vertical-align: -0.2em; color: #999999; cursor: help" size="16">
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>
                :
              </span>
            </template>
            <component
              :is="item.type"
              v-model="queryParams.value[item.prop]"
              :params="queryParams"
              :attrs="item.attrs"
              :transform="item.transform"
            />
          </el-form-item>
        </template>
      </el-form>
      <div class="table-pro__header--actions">
        <Button type="primary" icon="search" :loading="loading" @click="handleSearch()">
          {{ searchConfig.searchText }}
        </Button>
        <Button icon="refresh" :disabled="loading" @click="handleReset()">
          {{ searchConfig.resetText }}
        </Button>
        <Button
          v-if="searchConfig.isExpandable && searchConfig.formItems.length > searchcolnum"
          type="primary"
          link
          @click="handleCollapseExpand()"
        >
          <el-icon class="collapse-icon">
            <DArrowRight v-show="searchConfig.isExpand" />
            <DArrowLeft v-show="!searchConfig.isExpand" />
          </el-icon>
        </Button>
      </div>
    </section>
    <section v-loading="loading" class="table-pro__content" :style="{ marginTop: props.searchConfig ? '15px' : '' }">
      <div
        v-if="
          $slots.tableInfo ||
          $slots.toolbarAction ||
          toolbarConfig?.title ||
          toolbarConfig?.exportUrl ||
          toolbarConfig?.defaultToolbar?.length
        "
        class="table-pro__content--toolbar"
      >
        <div class="table-pro__content--toolbar-left">
          <div v-if="toolbarConfig?.title" style="margin-right: 20px; font-size: 16px">{{ toolbarConfig?.title }}</div>
          <slot name="tableInfo" :tableData="tableData" :queryParams="queryParams"></slot>
        </div>
        <div class="table-pro__content--toolbar-right">
          <div class="table-pro__content--toolbar-right-actions">
            <slot name="toolbarAction" :tableData="tableData" :queryParams="queryParams"></slot>
            <Button
              v-if="toolbarConfig?.exportUrl"
              icon="download"
              :loading="exportLoading"
              @click="handleExport(toolbarConfig?.exportUrl)"
            >
              导出
            </Button>
          </div>
          <div v-if="toolbarConfig.defaultToolbar?.length" class="table-pro__content--toolbar-right-settings">
            <template v-for="item in toolbarConfig.defaultToolbar" :key="item">
              <el-button v-if="item === 'refresh'" circle icon="refresh" title="刷新" @click="refresh()"></el-button>
            </template>
          </div>
        </div>
      </div>
      <div class="table-pro__content--list">
        <el-table
          ref="table"
          :data="tableData"
          :row-key="tableConfig.rowKey"
          :emptyText="tableConfig.emptyText"
          style="width: 100%"
          :class="[tableConfig.className]"
          header-row-class-name="table-header"
          :header-cell-style="tableConfig.headerCellStyle"
          :highlight-current-row="tableConfig.highlightCurrentRow"
          :fit="tableConfig.fit"
          :stripe="tableConfig.stripe"
          :border="tableConfig.border"
          :show-header="tableConfig.showHeader"
          height="100%"
          @current-change="handleCurrentChange"
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChange"
        >
          <el-table-column
            v-if="tableConfig.multiple"
            type="selection"
            align="center"
            width="55"
            fixed="left"
            :selectable="tableConfig.selectable"
            :reserve-selection="tableConfig.reserveSelection"
          />
          <el-table-column
            v-if="tableConfig.showIndex"
            type="index"
            label="序号"
            width="70"
            fixed="left"
            align="center"
            :index="(index: number) => (pageParams.page - 1) * pageParams.pageSize + index + 1"
          />
          <template v-for="(col, index) of tableConfig.columns" :key="index">
            <el-table-column
              :prop="col.prop as string"
              :align="col.align"
              :show-overflow-tooltip="col.showOverflowTooltip"
              :label="col.label"
              :label-class-name="col.labelClassName"
              :min-width="col.width"
              :resizable="col.resizable ?? true"
              :formatter="col.formatter"
              :fixed="col.fixed"
              :class-name="col.className"
              :sortable="col.sortable"
              :sort-by="col.sortBy"
              :sort-method="col.sortMethod"
            >
              <template #header v-if="col.tip">
                {{ col.label }}
                <el-tooltip placement="top" :content="col.tip" raw-content>
                  <el-icon style="vertical-align: -0.2em; color: #999999; cursor: help" size="16">
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>
              </template>
              <template v-if="col.slotName" #default="scope">
                <slot
                  :name="col.slotName"
                  :row="scope.row"
                  :column="scope.column"
                  :$index="scope.$index"
                  :queryParams="queryParams"
                />
              </template>
              <template v-else-if="col.formatter" #default="scope">
                <span
                  v-html="
                    col.formatter?.(scope.row, scope.column, scope.row[col.prop], scope.$index) ??
                    col.emptyText ??
                    tableConfig.cellEmptyText
                  "
                ></span>
                <!-- {{
                  col.formatter?.(scope.row, scope.column, scope.row[col.prop], scope.$index) ??
                  col.emptyText ??
                  tableConfig.cellEmptyText
                }} -->
              </template>
              <template v-else-if="col.enum" #default="scope">
                <div class="enum-cell">
                  <span
                    v-if="col.enum?.find((item) => item.value === scope.row[col.prop])?.type"
                    :class="['enum-cell-mark', col.enum?.find((item) => item.value === scope.row[col.prop])?.type]"
                  >
                    <span class="enum-cell-mark-inner"></span>
                  </span>
                  <span>
                    {{
                      col.enum?.find((item) => item.value === scope.row[col.prop])?.label ??
                      col.emptyText ??
                      tableConfig.cellEmptyText
                    }}
                  </span>
                </div>
              </template>
              <template v-else #default="scope">
                <CopyBtn
                  v-if="col.copyable && scope.row[col.prop]"
                  :text="scope.row[col.prop]"
                  :style="{ marginRight: '4px', verticalAlign: '-0.15em' }"
                />
                <span>{{ scope.row[col.prop] ?? col.emptyText ?? tableConfig.cellEmptyText }}</span>
              </template>
            </el-table-column>
          </template>
          <slot name="column" />
        </el-table>
      </div>
    </section>
    <section v-if="tableConfig.multiple || $slots.footerInfo || props.pagination !== null" class="table-pro__footer">
      <div class="table-pro__footer--left">
        <div v-if="tableConfig.multiple" class="select-info">
          已选
          <span class="select-count">{{ selectedRows.length }}</span>
          条
        </div>
        <div class="footer-info">
          <slot name="footerInfo" :tableData="tableData"></slot>
        </div>
      </div>
      <template v-if="props.pagination !== null">
        <el-pagination
          v-model:current-page="pageParams.page"
          background
          size="small"
          :disabled="loading"
          v-model:page-size="pageParams.pageSize"
          v-model:page-sizes="pagination.pageSizes"
          :layout="pagination.layout"
          :total="tableTotal"
          @size-change="getData"
          @current-change="getData"
        />
      </template>
    </section>
  </div>
</template>

<style lang="scss" scoped>
  .table-pro {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

    &__header {
      display: flex;
      flex-shrink: 0;
      justify-content: space-between;
      padding: 15px;
      overflow: hidden;
      background-color: #ffffff;
      border-radius: 4px;

      &--search {
        display: grid;
        flex: 1;
        grid-template-columns: repeat(v-bind(searchcolnum), 1fr);
        gap: 15px;

        :deep(.el-form-item) {
          width: 100%;
          margin: 0;

          .el-form-item__label {
            padding-right: 5px;
          }
        }
      }

      &--actions {
        flex-shrink: 0;
        min-width: 172px;
        padding-left: 12px;
        text-align: right;

        .collapse-icon {
          transform: rotate(-90deg);
          transition: transform 0.2s;

          &:hover {
            transform: scale(1.5) rotate(-90deg);
          }
        }
      }
    }

    &__content {
      display: flex;
      flex: 1;
      flex-direction: column;
      overflow: hidden;
      background-color: #ffffff;
      border-radius: 4px;

      &--toolbar {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: space-between;
        padding: 10px 15px;

        &-left {
          display: flex;
          align-items: center;
        }

        &-right {
          display: flex;
          align-items: center;
          margin-left: 100px;

          &-settings {
            padding-left: 12px;
          }
        }
      }

      &--list {
        flex: 1;
        overflow: hidden;

        :deep(.el-table) {
          .cell {
            color: #666666;
          }

          th {
            padding: 12px 0;
            background-color: #e2ecfe;

            &.el-table-fixed-column--left,
            &.el-table-fixed-column--right {
              background-color: #e2ecfe;
            }

            .cell {
              color: #292e35;
            }
          }

          .enum-cell {
            display: flex;
            align-items: center;

            &-mark {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 14px;
              height: 14px;
              margin-right: 5px;
              border-radius: 50%;

              &-inner {
                display: inline-block;
                width: 7px;
                height: 7px;
                border-radius: 50%;
              }

              &.primary {
                background-color: rgba($color: $color-blue, $alpha: 20%);

                .enum-cell-mark-inner {
                  background-color: $color-blue;
                }
              }

              &.success {
                background-color: rgba($color: $color-green, $alpha: 20%);

                .enum-cell-mark-inner {
                  background-color: $color-green;
                }
              }

              &.warning {
                background-color: rgba($color: $color-yellow, $alpha: 20%);

                .enum-cell-mark-inner {
                  background-color: $color-yellow;
                }
              }

              &.danger {
                background-color: rgba($color: $color-red, $alpha: 20%);

                .enum-cell-mark-inner {
                  background-color: $color-red;
                }
              }

              &.info {
                background-color: rgba($color: $color-gray, $alpha: 20%);

                .enum-cell-mark-inner {
                  background-color: $color-gray;
                }
              }
            }
          }
        }
      }
    }

    &__footer {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: space-between;
      padding: 10px 15px;
      background-color: #ffffff;

      &--left {
        display: flex;
        align-items: center;
        margin-right: 100px;
        line-height: 1.25;

        .select-info {
          flex-shrink: 0;
          margin-right: 15px;
          font-size: 14px;

          .select-count {
            font-size: 16px;
            color: $color-blue;
          }
        }

        .footer-info {
          font-size: 14px;
          color: $color-gray;
        }
      }
    }
  }
</style>
