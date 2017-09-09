import * as React from 'react';
import { BaseComponent, css, findScrollableParent, getParent } from '../../Utilities';
import { IObjectWithKey } from '../../utilities/selection/index';
import { IVirtualizedListProps } from './VirtualizedList.Props';

// import * as stylesImport from './VirtualizedList.scss';

const ScrollDebounceDelayDefaultInMs = 50;

interface IRange {
  start: number;
  end: number;
}

function isInRange(range: IRange, index: number): boolean {
  return range.start <= index && index < range.end;
}

export interface IVirtualizedListState {
  viewportHeight: number;

  scrollTop: number;
}

export class VirtualizedList<TItem extends IObjectWithKey>
  extends BaseComponent<IVirtualizedListProps<TItem>, IVirtualizedListState> {

  private _root: HTMLElement;
  private _scrollContainer: HTMLElement | Window;

  private _focusedIndex: number = -1;

  // tslint:disable-next-line:no-any
  constructor(props: IVirtualizedListProps<TItem>, context: any) {
    super(props, context);

    const {
      initialViewportHeight = window.innerHeight,  // Start with the window height if not passed in props, this does not cause layout
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
    this._scrollContainer = findScrollableParent(this._root)!;
    if (!this._scrollContainer) {
      throw new Error('Could not find scroll container');
    }

    // TODO: CS: DEBUG
    console.log('Scroll container', this._scrollContainer);

    this._events.on(this._scrollContainer, 'scroll', this._onScroll);

    this._events.on(this._root, 'focus', this._onFocus, true);
  }

  public render(): JSX.Element {
    const { className } = this.props;

    // TODO: Make element overflow auto, works better with how people use the list
    return (
      <div
        className={ css('ms-VirtualizedList'/*, hasExternalScrollContainer && styles.rootOverflow*/, className) }
        ref={ this._resolveRef('_root') }
      >
        { this._renderItems() }
      </div>
    );
  }

  private _renderItems(): (JSX.Element | null)[] {
    const {
      itemHeight,
      items,
      itemOverdraw = 2
    } = this.props;
    const { scrollTop, viewportHeight } = this.state;

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
    (this as any).test = 0;

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
        // or the first range does not start from the beginning insert spacer item
        const spacerStartIndex = (isFirstRange ? 0 : lastRenderedIndex);
        const gapBetweenRanges = range.start - spacerStartIndex;
        if (gapBetweenRanges > 0) {
          result.push(this._renderSpacerItem(gapBetweenRanges, spacerStartIndex));
        }
      }

      console.log('items', range.start, range.end);

      for (let i = range.start; i < range.end; ++i) {
        result.push(onRenderItem(items[i], i));
        (this as any).test++;
      }

      lastRenderedIndex = range.end;
    }

    // Insert final spacer item
    const itemCount = (items || []).length;
    if (lastRenderedIndex < itemCount - 1) {
      result.push(this._renderSpacerItem(itemCount - lastRenderedIndex, lastRenderedIndex));
    }

    console.log('------', (this as any).test);

    return result;
  }

  private _renderSpacerItem(numberOfItems: number, index: number): JSX.Element {
    const { itemHeight } = this.props;
    const height = numberOfItems * itemHeight;

    console.log('spacer', numberOfItems, index, height);

    (this as any).test += numberOfItems;

    return <div key={ `spacer-item-${index}` } style={ { height } } />;
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
