import { IItem, IListProps } from './List';
import { IBaseProps, IRenderFunction } from 'office-ui-fabric-react/lib/Utilities';

export interface IColumn {
  key: string;

  name: string;

  fieldName: string | null;

  minWidth: number;
  maxWidth?: number;

  /**
   * Optional property that determines whether the column can be dropped if there is not enough room to satisfy all min-width
   * requests. Only works for columns from right to left.
   */
  isCollapsable?: boolean;

  isResizable?: boolean;
}

export interface IColumnLayoutProvider<TItem> {
  onResizeColumn(columnKey: string, newWidth: number): void;

  renderColumn(column: IColumn): JSX.Element;
}

export interface IDataListListProps<TItem extends IItem> extends IListProps<TItem> {
  // TODO: CS:
  onRenderItem: any;
}

export interface IDataListProps<TItem extends IItem> extends IBaseProps {
  items: TItem[];

  columns: IColumn[];

  itemHeight: number;

  /** Specify list rendering */
  onRenderList?: IRenderFunction<IDataListListProps<TItem>>;

  onRenderRow?: (props: any) => JSX.Element;

  onRenderColumn?: (props: any) => JSX.Element;

  columnLayoutProvider?: IColumnLayoutProvider<TItem>;
}