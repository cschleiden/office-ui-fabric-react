import * as React from 'react';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import { IDetailsDataListProps } from './DetailsDataList.Props';
import { IDataListListProps } from './DataList.Props';
import { DataList } from './DataList';
import { IItem, IListProps } from './List';
import { IVirtualizedListProps, VirtualizedList } from './VirtualizedList';
import { FlexColumnLayoutProvider } from './Layouts/FlexColumnLayout';

/**
 * Variant of `DataList`, configured to behave as closely as possible to DetailsList
 */
export class DetailsDataList<TItem extends IItem> extends React.Component<IDetailsDataListProps<TItem>> {
  private _columnLayoutProvider: FlexColumnLayoutProvider<TItem>;

  constructor(props: IDetailsDataListProps<TItem>, context: any) {
    super(props, context);

    this._columnLayoutProvider = new FlexColumnLayoutProvider<TItem>();
  }

  render() {
    return <DataList
      {...this.props}

      columnLayoutProvider={ this._columnLayoutProvider }
    />;
  }

  @autobind
  private _renderList(listProps: IDataListListProps<TItem>) {
    const { itemHeight } = this.props;
    const { onRenderItem, ...rest } = listProps;

    return React.createElement(
      VirtualizedList,
      {
        ...rest,
        itemHeight,
        onRenderItem,
        itemOverdraw: 4
      } as IVirtualizedListProps<TItem>
    );
  }
}