import * as React from 'react';
import { BaseComponent, css, findScrollableParent, getParent, autobind } from '../../Utilities';
import { IObjectWithKey } from '../../utilities/selection/index';
import { IVirtualizedListProps } from './VirtualizedList.Props';
import { IScrollContainerContext, ScrollContainerContextTypes } from '../../utilities/scrolling/ScrollContainer';

interface IRange {
  /** Start of range */
  start: number;

  /** Exclusive end of range */
  end: number;
}

function isInRange(range: IRange, index: number): boolean {
  return range.start <= index && index < range.end;
}

export interface IVirtualizedListState {
  viewportHeight: number;

  items: React.ReactNode[];
}

export class VirtualizedList<TItem extends IObjectWithKey>
  extends BaseComponent<IVirtualizedListProps<TItem>, IVirtualizedListState> {
  public static contextTypes = ScrollContainerContextTypes;

  public context: IScrollContainerContext;

  private _root: HTMLElement;
  private _scrollContainer: HTMLElement | Window;

  private _spacerElements: HTMLElement[] = [];

  private _focusedIndex: number = -1;

  constructor(props: IVirtualizedListProps<TItem>, context: IScrollContainerContext) {
    super(props, context);

    const {
      initialViewportHeight = window.innerHeight  // Start with the window height if not passed in props, this does not cause layout
    } = this.props;

    this.state = {
      viewportHeight: initialViewportHeight,
      items: this._renderItems(0, initialViewportHeight)
    };
  }

  public componentDidMount(): void {
    // TODO: CS: This might force layout, remove?
    this._scrollContainer = findScrollableParent(this._root)!;
    if (!this._scrollContainer) {
      throw new Error('Could not find scroll container');
    }

    // console.log('Scroll container', this._scrollContainer);

    // this._events.on(this._scrollContainer, 'scroll', this._onScroll);

    this._events.on(this._root, 'focus', this._onFocus, true);

    this.context.scrollContainer.registerVisibleCallback((scrollTop) => {
      // console.log('intersect');
      this._render(scrollTop);
    });

    this.componentDidUpdate();
  }

  public componentDidUpdate() {
    // (Re-)register with the observer after every update, this way we'll get an intersection event immediately if one of the spacer
    // elements is visible right now.
    for (const ref of this._spacerElements) {
      this.context.scrollContainer.observe(ref);
    }
  }

  public componentWillUpdate() {
    for (const ref of this._spacerElements) {
      this.context.scrollContainer.unobserve(ref);
    }

    // this._spacerElements = [];
  }

  public render(): JSX.Element {
    const { className } = this.props;
    const { items } = this.state;

    // TODO: Make element overflow auto, works better with how people use the list
    return (
      <div
        className={ css('ms-VirtualizedList'/*, hasExternalScrollContainer && styles.rootOverflow*/, className) }
        ref={ this._resolveRef('_root') }
      >
        { items }
      </div>
    );
  }

  private _renderItems(scrollTop: number, viewportHeight: number): (JSX.Element | null)[] {
    const {
      itemHeight,
      items,
      itemOverdraw = 2
    } = this.props;

    // console.log('Scrolltop', scrollTop);

    let ranges: IRange[] = [];

    // Calculate visible range
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

    const visibleRange = {
      start: startIndex,
      end: endIndex
    };

    ranges.push(visibleRange);

    // Focused item
    if (this._focusedIndex !== -1 && !isInRange(visibleRange, this._focusedIndex)) {
      const focusRange: IRange = {
        start: this._focusedIndex,
        end: this._focusedIndex + 1
      };

      if (this._focusedIndex < visibleRange.start) {
        ranges.unshift(focusRange);
      } else {
        ranges.push(focusRange);
      }
    }

    return this._renderRanges(ranges);
  }

  private _renderRanges(ranges: IRange[]): (JSX.Element | null)[] {
    // (this as any).test = 0;

    const { items, onRenderItem } = this.props;
    const result: (JSX.Element | null)[] = [];

    // Assume ranges are sorted.
    const startIndex = 0;

    let lastRenderedIndex = -1;

    for (const range of ranges) {
      // Spacer item before range or between the last range and this one
      const isFirstRange = lastRenderedIndex === -1;
      if ((isFirstRange && range.start !== 0)
        || (!isFirstRange && lastRenderedIndex !== range.start)) {
        // Last range is not continuous with this one,
        // or the first range does not start from the beginning: insert spacer item
        const spacerStartIndex = (isFirstRange ? 0 : lastRenderedIndex);
        const gapBetweenRanges = range.start - spacerStartIndex;
        if (gapBetweenRanges > 0) {
          result.push(this._renderSpacerItem(gapBetweenRanges, spacerStartIndex));
        }
      }

      // console.log('items', (range.end - range.start), range.start, range.end);

      for (let i = range.start; i < range.end; ++i) {
        result.push(onRenderItem(items[i], i));
        // (this as any).test++;
      }

      lastRenderedIndex = range.end - 1;
    }

    // Insert final spacer item
    const itemCount = (items || []).length;
    if (lastRenderedIndex < itemCount - 1) {
      result.push(this._renderSpacerItem(itemCount - lastRenderedIndex, lastRenderedIndex));
    }

    // console.log('------', (this as any).test);

    return result;
  }

  private _renderSpacerItem(numberOfItems: number, index: number): JSX.Element {
    const {
      itemHeight,
      items = [],
      spacerItemTagName: ItemTag = 'div'
    } = this.props;

    const spacerHeight = numberOfItems * itemHeight;
    const itemCount = items.length;

    // Ideally we would reuse
    let key: string;
    if (index === 0) {
      key = `spacer-start`;
    } else if (index + numberOfItems === itemCount) {
      key = `spacer-end`;
    } else {
      key = `spacer-item-${index + numberOfItems}`;
    }

    /*
    else if (index + numberOfItems === itemCount) {
      key = `spacer-end-${index}`;
    } else {
      key = `spacer-item-${index + numberOfItems}`;
      */

    return <ItemTag ref={ this._spacerRef } key={ key } style={ { height: spacerHeight } } />;
  }

  @autobind
  private _spacerRef(ref: HTMLElement) {
    if (ref) {
      // this.context.scrollContainer.observe(ref);
      this._spacerElements.push(ref);
    }
  }

  private _render(scrollTop: number): void {
    // TODO: CS: Can we use intersectionobserver here?
    // this._async.requestAnimationFrame(() => {
    //  let scrollTop = 0;
    // if (this._scrollContainer === window) {
    //   scrollTop = this._scrollContainer.scrollY;
    // } else {
    //   scrollTop = (this._scrollContainer as HTMLElement).scrollTop;
    // }

    scrollTop = Math.floor(scrollTop);

    this.setState({
      items: this._renderItems(scrollTop, this.state.viewportHeight)
    });
    // });
  }

  private _onFocus(ev: React.FocusEvent<HTMLDivElement>) {
    let target = ev.target as HTMLElement;

    while (target !== this._root) {
      let indexString = target.getAttribute('data-selection-index');

      if (indexString) {
        this._focusedIndex = Number(indexString);
        break;
      }

      target = getParent(target) as HTMLElement;
    }
  }
}
