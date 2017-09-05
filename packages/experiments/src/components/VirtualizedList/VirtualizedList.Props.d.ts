import { IBaseProps } from 'office-ui-fabric-react/lib/Utilities';
import { IObjectWithKey } from 'office-ui-fabric-react/lib/utilities/selection/index';
import { IListProps } from '../StaticList/List.Props';

export interface IVirtualizedListProps<TItem extends IObjectWithKey> extends IListProps<TItem>, IBaseProps {
  /** Initial height of the viewport in pixels */
  initialViewportHeight?: number;

  /** Height of individual item in pixels */
  itemHeight: number;

  /** Number of items to draw before/after viewport height */
  itemOverdraw?: number;

  /** Milliseconds to wait before re-rendering after a scroll event occured, set to 0 to disable debounce */
  scrollDebounceDelay?: number;
}