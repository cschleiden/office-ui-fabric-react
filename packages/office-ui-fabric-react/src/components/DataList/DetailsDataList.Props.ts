import {
  SelectionMode
} from '../../utilities/selection/index';
import { IDataListColumn, IDataListItem } from './DataList.Props';

export interface IDetailsDataListProps<TItem extends IDataListItem> {
  items: TItem[];

  columns: IDataListColumn<TItem>[];

  rowHeight: number;

  selectionMode: SelectionMode;
}