import * as React from 'react';
import { mergeStyles, SelectionMode } from 'office-ui-fabric-react/lib';
import { IDataListRowRenderer, IDataListHeaderProps, IDataListItem } from './DataList.Props';
import { DataListRowRenderer } from './DataListRow';

export class DataListHeader<TItem extends IDataListItem> extends React.PureComponent<IDataListHeaderProps<TItem>> {
  private _headerItem: { [columnName: string]: string };
  private _renderer: IDataListRowRenderer<TItem>;

  // tslint:disable-next-line:no-any
  constructor(props: IDataListHeaderProps<TItem>, context: any) {
    super(props, context);

    const { columns } = this.props;

    this._headerItem = {};
    for (const column of columns) {
      this._headerItem[column.fieldName || column.key] = column.name;
    }

    this._renderer = new DataListRowRenderer<TItem>();
  }

  public render(): JSX.Element {
    const {
      className,
      columns,
      rowHeight,
      selection
    } = this.props;

    return (
      <div
        className={ mergeStyles(
          {
            height: rowHeight
          },
          className,
          'ms-DataListHeader'
        ) as string }
        // tslint:disable-next-line:jsx-ban-props
        style={ {
          height: rowHeight
        } }
      >
        { this._renderer.renderRow({
          columns,
          rowHeight,
          index: -1,
          // tslint:disable-next-line:no-any
          item: this._headerItem as any,
          selection: selection,
          selectionMode: SelectionMode.none
        }) }
      </div>
    );
  }
}