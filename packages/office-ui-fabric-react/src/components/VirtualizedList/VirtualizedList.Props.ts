import { IBaseProps } from '../..//Utilities';
import { IObjectWithKey } from '../../utilities/selection/index';
import { IGenericListProps } from '../StaticList/List.Props';

export interface IVirtualizedListProps<TItem extends IObjectWithKey> extends IGenericListProps<TItem>, IBaseProps {
  /** Initial height of the viewport in pixels */
  initialViewportHeight?: number;

  /** Height of individual item in pixels */
  itemHeight: number;

  /** Number of items to draw before/after viewport height */
  itemOverdraw?: number;

  /** Milliseconds to wait before re-rendering after a scroll event occured, set to 0 to disable debounce */
  scrollDebounceDelay?: number;

  spacerItemTagName?: string;
}