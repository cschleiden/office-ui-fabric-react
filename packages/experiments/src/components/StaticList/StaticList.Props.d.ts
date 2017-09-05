import { IObjectWithKey } from 'office-ui-fabric-react/lib/utilities/selection/index';
import { IListProps } from './List.Props';

export interface IStaticListProps<TItem extends IObjectWithKey> extends IListProps<TItem> {
  listTagName?: string;
}
