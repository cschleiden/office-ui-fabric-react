import { IRenderFunction } from 'office-ui-fabric-react/lib/Utilities';

export interface IItem {
  key: string;
}

export interface IList<TItem extends IItem> {
}

export interface IListProps<TItem extends IItem> {
  className?: string;

  items: TItem[];

  itemHeight: number;

  onRenderItem: (item: TItem, index: number) => JSX.Element | null;
}