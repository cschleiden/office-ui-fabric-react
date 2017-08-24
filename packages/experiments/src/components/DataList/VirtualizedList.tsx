import * as React from 'react';
import { IBaseProps, BaseComponent, css, findScrollableParent } from 'office-ui-fabric-react/lib/Utilities';
import { IItem, IListProps, IList } from './List';

import * as stylesImport from './VirtualizedList.scss';
const styles: any = stylesImport;

export interface IVirtualizedListProps<TItem extends IItem> extends IListProps<TItem>, IBaseProps {
  initialViewportHeight?: number;

  /** Height of individual item in pixels */
  itemHeight: number;

  /** Number of items to draw before/after viewport height */
  itemOverdraw?: number;
}

export interface IVirtualizedListState<TItem extends IItem> {
  viewportHeight: number;

  scrollTop: number;
}

export class VirtualizedList<TItem extends IItem = any> extends BaseComponent<IVirtualizedListProps<TItem>, IVirtualizedListState<TItem>> {
  private root: HTMLElement;
  private scrollContainer: HTMLElement;

  constructor(props: IVirtualizedListProps<TItem>, context: any) {
    super(props, context);

    const {
      initialViewportHeight = window.innerHeight  // Start with the window height if not passed in props
    } = this.props;

    this.state = {
      viewportHeight: initialViewportHeight,
      scrollTop: 0
    };

    this._onScroll = this._async.debounce(this._onScroll, 100, {
      leading: true // We want to execute one iteration immediately after we render
    });
  }

  public componentDidMount() {
    // TODO: CS: This forces layout, remove?
    this.scrollContainer = findScrollableParent(this.root)!;
    if (!this.scrollContainer) {
      throw new Error('Could not find scroll container');
    }

    this._events.on(this.scrollContainer, 'scroll', this._onScroll);
  }

  public componentWillUnmount() {
    this._events.off(this.scrollContainer, 'scroll');
  }

  public render() {
    const { className } = this.props;

    // TODO: Make element overflow auto, works better with how people use the list
    return <div
      className={ css(styles.root/*, hasExternalScrollContainer && styles.rootOverflow*/, className) }
      ref={ this._resolveRef('root') }>
      { this._renderItems() }
    </div>;
  }

  private _renderItems(): (JSX.Element | null)[] {
    const {
      itemHeight,
      items,
      onRenderItem,
      itemOverdraw = 2
    } = this.props;
    const { scrollTop, viewportHeight } = this.state;

    const result: (JSX.Element | null)[] = [];

    // Calculate items to render
    const startIndex = Math.floor(
      Math.max(
        scrollTop / itemHeight - itemOverdraw,
        0)
    );
    const endIndex = Math.floor(
      Math.min(
        startIndex + (itemOverdraw * 2) + (viewportHeight / itemHeight),
        items.length)
    );
    for (let i = startIndex; i < endIndex; ++i) {
      result.push(onRenderItem(items[i], i));
    }

    // Generate spacer items
    const startSpacerHeight = startIndex * itemHeight;
    if (startSpacerHeight > 0) {
      result.unshift(<li key='spacer-item-start' style={ { height: startSpacerHeight } } />);
    }

    const endSpacerHeight = (items.length - endIndex) * itemHeight;
    if (endSpacerHeight > 0) {
      result.push(<li key='spacer-item-end' style={ { height: endSpacerHeight } } />);
    }

    return result;
  }

  private _onScroll() {
    // TODO: CS: Can we use intersectionobserver here?
    this._async.requestAnimationFrame(() => {
      let scrollTop = 0;
      if (this.scrollContainer as any === window) {
        scrollTop = (this.scrollContainer as any).scrollY;
      } else {
        scrollTop = this.scrollContainer.scrollTop;
      }

      this.setState({
        scrollTop
      });
    });
  }
}
