import { IBaseProps, IRenderFunction } from '../../Utilities';
import {
  IObjectWithKey,
  ISelection,
  SelectionMode
} from '../../utilities/selection/index';
import { IGenericListProps } from '../StaticList/index';

export type IDataListItem = IObjectWithKey;

export interface IDataListColumn<TItem extends IDataListItem> {
  key: string;

  name: string;

  fieldName: string | null;

  minWidth: number;
  maxWidth?: number;

  /**
   * Optional property that determines whether the column can be dropped if there is not enough room to satisfy all min-width
   * requests. Only works for columns from right to left.
   */
  isCollapsible?: boolean;

  isResizable?: boolean;

  onRenderColumn?: IRenderFunction<IDataListColumnRowProps<TItem>>;

  onRenderColumnContent?: IRenderFunction<IDataListColumnRowProps<TItem>>;
}

export interface IDataListColumnRowProps<TItem extends IDataListItem> {
  row: IDataListRowProps<TItem>;

  column: IDataListColumn<TItem>;

  columnIndex: number;
}

export interface IColumnLayoutProvider<TItem extends IDataListItem> {
  onResizeColumn(columnKey: string, newWidth: number): void;

  renderColumn(column: IDataListColumn<TItem>): JSX.Element;

  // tslint:disable-next-line:member-ordering
  dummy?: TItem;
}

export interface IDataListListProps<TItem extends IDataListItem> extends IGenericListProps<TItem> {
  // TODO: CS:
  // tslint:disable-next-line:no-any
  onRenderItem: any;
}

export interface IDataListHeaderProps<TItem extends IDataListItem> {
  className?: string;

  columns: IDataListColumn<TItem>[];

  rowHeight: number;

  selection: ISelection;
}

export interface IDataListRowProps<TItem extends IDataListItem> {
  className?: string;

  columns: IDataListColumn<TItem>[];

  index: number;

  item: TItem;

  rowHeight: number;

  // TODO
  dropColumns?: boolean;

  selection: ISelection;

  selectionMode: SelectionMode;
}

export interface IDataListRowRenderer<TItem extends IDataListItem> {
  renderRow(props: IDataListRowProps<TItem>): JSX.Element;
}

export interface IDataListProps<TItem extends IDataListItem> extends IBaseProps {
  className?: string;

  items: TItem[];

  columns: IDataListColumn<TItem>[];

  selectionMode?: SelectionMode;

  /** Height of one row in the data list */
  rowHeight: number;

  /** Specify list rendering */
  onRenderList?: IRenderFunction<IDataListListProps<TItem>>;

  onRenderRow?: IRenderFunction<IDataListRowProps<TItem>>;

  onRenderHeader?: IRenderFunction<IDataListHeaderProps<TItem>>;

  // TODO
  // tslint:disable-next-line:no-any
  onRenderColumn?: (props: any) => JSX.Element;

  columnLayoutProvider?: IColumnLayoutProvider<TItem>;
}