import type { TableColumn } from './type';

/**
 * 合并table列表数据
 * @param columns 列表数据
 * @param assignObj 待合并操作项
 * @returns
 */
export const mergeTableColumns = <T extends Recordable = Recordable>(
  columns: TableColumn<T>[],
  assignObj: Record<string, TableColumn<T>>
): TableColumn<T>[] => {
  return columns.map((item) => {
    let newItem = item;
    Object.keys(assignObj).forEach((key) => {
      if (item.prop === key) {
        newItem = {
          ...item,
          ...assignObj[key]
        };
      }
    });
    return newItem;
  });
};
