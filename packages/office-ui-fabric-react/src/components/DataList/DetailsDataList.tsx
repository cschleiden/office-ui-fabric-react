import * as React from 'react';
import {
  SelectionMode
} from '../../utilities/selection/index';
import { autobind, css } from '../../Utilities';
import { IDetailsDataListProps } from './DetailsDataList.Props';
import { IDataListListProps, IDataListHeaderProps, IDataListRowProps, IDataListItem } from './DataList.Props';
import { DataList } from './DataList';
import { IVirtualizedListProps, VirtualizedList } from '../VirtualizedList/index';
import { FlexColumnLayoutProvider } from './Layouts/FlexColumnLayout';
import { DataListCheckColumn } from './Selection/DataListCheckColumn';

import * as stylesImport from './DetailsDataList.scss';
import * as headerStyles from '../DetailsList/DetailsHeader.scss';
import * as rowStyles from '../DetailsList/DetailsRow.scss';

/**
 * Variant of `DataList`, configured to behave as closely as possible to DetailsList
 */
export class DetailsDataList<TItem extends IDataListItem> extends React.Component<IDetailsDataListProps<TItem>> {
  private _columnLayoutProvider: FlexColumnLayoutProvider<TItem>;

  // tslint:disable-next-line:no-any
  constructor(props: IDetailsDataListProps<TItem>, context: any) {
    super(props, context);

    this._columnLayoutProvider = new FlexColumnLayoutProvider<TItem>();
  }

  public render(): JSX.Element {
    const { columns: inputColumns, selectionMode } = this.props;

    let columns = inputColumns;
    if (selectionMode !== SelectionMode.none) {
      const checkColumn = new DataListCheckColumn<TItem>();
      columns = [checkColumn, ...inputColumns];
    }

    return (
      <DataList
        {...this.props}
        columns={ columns }
        className={ css(stylesImport.root) }
        onRenderHeader={ this._renderHeader }
        onRenderList={ this._renderList }
        onRenderRow={ this._renderRow }
        columnLayoutProvider={ this._columnLayoutProvider }
        rowHeight={ 42 }
      />
    );
  }

  @autobind
  private _renderHeader(
    headerProps: IDataListHeaderProps<TItem>, defaultRender: (props: IDataListHeaderProps<TItem>) => JSX.Element): JSX.Element {
    return defaultRender({
      ...headerProps,
      className: headerStyles.root
    });
  }

  @autobind
  private _renderList(listProps: IDataListListProps<TItem>): JSX.Element {
    const { onRenderItem, ...rest } = listProps;

    return React.createElement(
      VirtualizedList,
      {
        ...rest,
        onRenderItem,
        itemOverdraw: 4,
        initialViewportHeight: 800,
        scrollDebounceDelay: 0,
      } as IVirtualizedListProps<TItem>
    );
  }

  @autobind
  private _renderRow(rowProps: IDataListRowProps<TItem>, defaultRender: (props: IDataListRowProps<TItem>) => JSX.Element): JSX.Element {
    const {
      index,
      selection
    } = rowProps;

    const selected = selection.isIndexSelected(index);

    return defaultRender({
      ...rowProps,
      className: css(
        rowStyles.root,
        selected && `${rowStyles.rootIsSelected} is-selected`,
      )
    });
  }
}