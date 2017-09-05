import * as React from 'react';
import { BaseComponent, css, findScrollableParent } from 'office-ui-fabric-react/lib/Utilities';
import { IObjectWithKey } from 'office-ui-fabric-react/lib/utilities/selection/index';
import { IVirtualizedListProps } from './VirtualizedList.Props';

// import * as stylesImport from './VirtualizedList.scss';

const ScrollDebounceDelayDefaultInMs = 50;

export interface IVirtualizedListState {
  viewportHeight: number;

  scrollTop: number;
}

export class VirtualizedList<TItem extends IObjectWithKey>
  extends BaseComponent<IVirtualizedListProps<TItem>, IVirtualizedListState> {
  private root: HTMLElement;
  private _scrollContainer: HTMLElement | Window;

  // tslint:disable-next-line:no-any
  constructor(props: IVirtualizedListProps<TItem>, context: any) {
    super(props, context);

    const {
      initialViewportHeight = window.innerHeight,  // Start with the window height if not passed in props
      scrollDebounceDelay = ScrollDebounceDelayDefaultInMs
    } = this.props;

    this.state = {
      viewportHeight: initialViewportHeight,
      scrollTop: 0
    };

    if (scrollDebounceDelay > 0) {
      this._onScroll = this._async.debounce(this._onScroll, scrollDebounceDelay, {
        leading: true // We want to execute one iteration immediately after we render
      });
    }
  }

  public componentDidMount(): void {
    // TODO: CS: This might force layout, remove?
    this._scrollContainer = findScrollableParent(this.root)!;
    if (!this._scrollContainer) {
      throw new Error('Could not find scroll container');
    }

    console.log('Scroll container', this._scrollContainer);

    this._events.on(this._scrollContainer, 'scroll', this._onScroll);
  }

  public render(): JSX.Element {
    const { className } = this.props;

    // TODO: Make element overflow auto, works better with how people use the list
    return (
      <div
        className={ css('ms-VirtualizedList'/*, hasExternalScrollContainer && styles.rootOverflow*/, className) }
        ref={ this._resolveRef('root') }
      >
        { this._renderItems() }
      </div>
    );
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
      // tslint:disable-next-line:jsx-ban-props
      result.unshift(<div key='spacer-item-start' style={ { height: startSpacerHeight } } />);
    }

    const endSpacerHeight = (items.length - endIndex) * itemHeight;
    if (endSpacerHeight > 0) {
      // tslint:disable-next-line:jsx-ban-props
      result.push(<div key='spacer-item-end' style={ { height: endSpacerHeight } } />);
    }

    return result;
  }

  private _onScroll(): void {
    // TODO: CS: Can we use intersectionobserver here?
    this._async.requestAnimationFrame(() => {
      let scrollTop = 0;
      if (this._scrollContainer === window) {
        scrollTop = this._scrollContainer.scrollY;
      } else {
        scrollTop = (this._scrollContainer as HTMLElement).scrollTop;
      }

      this.setState({
        scrollTop
      });
    });
  }
}
