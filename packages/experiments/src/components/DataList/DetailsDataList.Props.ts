import { IItem, IListProps } from './List';
import { IColumn } from './DataList.Props';
import { IRenderFunction } from 'office-ui-fabric-react/lib/Utilities';

export interface IDetailsDataListProps<TItem extends IItem> {
  items: TItem[];

  columns: IColumn[];

  itemHeight: number;
}