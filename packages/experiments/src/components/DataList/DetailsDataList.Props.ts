import { IObjectWithKey, SelectionMode } from 'office-ui-fabric-react/lib/utilities/selection/index';
import { IColumn } from './DataList.Props';

export interface IDetailsDataListProps<TItem extends IObjectWithKey> {
  items: TItem[];

  columns: IColumn<TItem>[];

  rowHeight: number;

  selectionMode: SelectionMode;
}