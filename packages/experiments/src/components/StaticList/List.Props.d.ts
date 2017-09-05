import { IRenderFunction } from 'office-ui-fabric-react/lib/Utilities';
import { IObjectWithKey } from 'office-ui-fabric-react/lib/utilities/selection/index';

export interface IList<TItem extends IObjectWithKey> {
}

export interface IListProps<TItem extends IObjectWithKey> {
  className?: string;

  items: TItem[];

  itemHeight: number;

  onRenderItem: (item: TItem, index: number) => JSX.Element | null;
}