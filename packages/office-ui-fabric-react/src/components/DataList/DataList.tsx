import * as React from 'react';
import { BaseComponent, autobind, IRenderFunction, css } from '../../Utilities';
import {
  ISelection,
  Selection,
  SelectionMode,
  SelectionZone,
  SELECTION_CHANGE
} from '../../utilities/selection/index';
import { FocusZone, FocusZoneDirection } from '../FocusZone/index';
import { StaticList } from '../StaticList/index';
import { DataListRowRenderer } from './DataListRow';
import { DataListHeader } from './DataListHeader';
import {
  IDataListProps, IDataListListProps, IDataListRowRenderer, IDataListHeaderProps, IDataListRowProps, IDataListItem
} from './DataList.Props';

import * as stylesImport from './DataList.scss';
// tslint:disable-next-line:no-any
const styles: any = stylesImport;

export class DataList<TItem extends IDataListItem = IDataListItem> extends BaseComponent<IDataListProps<TItem>, {}> {
  // tslint:disable-next-line:typedef
  public static defaultProps = {
    selectionMode: SelectionMode.single
  };

  private _selection: ISelection;

  private _rowRenderer: IDataListRowRenderer<TItem> = new DataListRowRenderer();

  // tslint:disable-next-line:typedef
  private start = 0;

  // tslint:disable-next-line:no-any
  constructor(props: IDataListProps<TItem>, context: any) {
    super(props, context);

    this._selection = new Selection();
    this._selection.setItems(this.props.items, true);
  }

  public render(): JSX.Element {
    const {
      items,
      rowHeight,
      columns,
      onRenderHeader = this._renderHeader,
      onRenderList = this._renderList,
      selectionMode
     } = this.props;

    return (
      <div
        className={ css(
          'ms-DataList'
        ) }
        ref={ this._resolveRef('container') }
      >

        {
          onRenderHeader(
            {
              columns,
              rowHeight,
              selection: this._selection
            },
            this._renderHeader)
        }

        <FocusZone
          ref={ this._resolveRef('_focusZone') }
          className={ styles.focusZone }
          direction={ FocusZoneDirection.vertical }
          // tslint:disable-next-line:jsx-no-lambda
          isInnerZoneKeystroke={ () => false }
        >
          <SelectionZone
            ref={ this._resolveRef('_selectionZone') }
            selection={ this._selection }
            selectionPreservedOnEmptyClick={ true }
            selectionMode={ selectionMode }
          >

            {
              onRenderList(
                {
                  items,
                  itemHeight: rowHeight,
                  className: 'ms-DataListList',
                  onRenderItem: this._renderItem
                })
            }

          </SelectionZone>
        </FocusZone>
      </div>
    );
  }

  public componentWillMount(): void {
    performance.mark('control-start');
    this.start = performance.now();
  }

  public componentDidMount(): void {
    this._events.on(this._selection, SELECTION_CHANGE, this._onSelectionChanged);

    performance.mark('control-end');
    performance.measure('control', 'control-start', 'control-end');

    console.log(`DataList rendering ${performance.now() - this.start}ms`);
  }

  public componentWillReceiveProps(nextProps: IDataListProps<TItem>): void {
    const shouldResetSelection = true;

    if (nextProps.items !== this.props.items) {
      this._selection.setItems(nextProps.items, shouldResetSelection);
    }
  }

  private _renderHeader: IRenderFunction<IDataListHeaderProps<TItem>> = (headerProps: IDataListHeaderProps<TItem>): JSX.Element => {
    const {
      columns
    } = this.props;

    return (
      <DataListHeader
        {...{
          ...headerProps,
          columns: columns,
          selection: this._selection,
        }}
      />
    );
  }

  @autobind
  private _renderList(listProps: IDataListListProps<TItem>): React.ReactNode {
    return (
      <StaticList
        {...listProps }
      />
    );
  }

  @autobind
  private _renderItem(item: TItem, index: number): JSX.Element | null {
    const {
      columns,
      onRenderRow = this._renderRow,
      rowHeight,
      selectionMode = DataList.defaultProps.selectionMode
    } = this.props;

    return onRenderRow({
      columns,
      dropColumns: false, // TODO
      item,
      index,
      rowHeight,
      selection: this._selection,
      selectionMode
    }, this._renderRow);
  }

  private _renderRow: IRenderFunction<IDataListRowProps<TItem>> = (rowProps: IDataListRowProps<TItem>): JSX.Element => {
    return this._rowRenderer.renderRow(rowProps);
  }

  private _onSelectionChanged(): void {
    // TODO: We should be smarter here
    this.forceUpdate();
  }
}
