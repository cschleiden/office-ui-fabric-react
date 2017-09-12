import * as React from 'react';
import { BaseComponent, autobind } from '../../Utilities';

export interface IScrollContainer {
  observe(element: HTMLElement, callback: () => void): void;
}

export interface IScrollContainerContext {
  scrollContainer: IScrollContainer;
}

declare var IntersectionObserver: any;

export class ScrollContainer extends BaseComponent<{}> implements IScrollContainer {
  public static childContextTypes = {
    scrollContainer: React.PropTypes.object.isRequired
  };

  private _observer: IntersectionObserver;

  public getChildContext(): IScrollContainerContext {
    return {
      scrollContainer: this
    };
  }

  public observe(element: HTMLElement, callback: () => void): void {
    this._observer.observe(element);
  }

  public render(): JSX.Element {
    const { children } = this.props;

    return children as JSX.Element;
  }

  public componentDidMount() {
    if (typeof IntersectionObserver === 'object') {
      this._observer = new IntersectionObserver(
        this._onIntersection,
        {
          root: null,
          rootMargin: '100% 0%',
          treshold: 0
        }
      );
    } else {
      // No intersection observer, can we find an alternative?
    }
  }

  @autobind
  private _onIntersection() {
    console.log('Intersection');
  }
}