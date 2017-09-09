import * as React from 'react';
import { IDataListColumn, IDataListRowRenderer, IDataListRowProps, IDataListColumnRowProps, IDataListItem } from './DataList.Props';
import { mergeStyles } from '../../Styling';
import { IRenderFunction } from '../../Utilities';

import * as stylesImport from './DataListRow.scss';

export class DataListRowRenderer<TItem extends IDataListItem> implements IDataListRowRenderer<TItem> {
  public renderRow(props: IDataListRowProps<TItem>): JSX.Element {
    const { className, dropColumns, item, rowHeight, selection, index } = props;

    let isSelected = false;
    if (item && item.key !== undefined && selection) {
      isSelected = selection.isKeySelected(item.key.toString());
    }

    return (
      <div
        key={ item.key }
        className={ mergeStyles(
          'ms-DataListRow',
          stylesImport.row,
          dropColumns && stylesImport.rowDropColumns,
          isSelected && stylesImport.rowSelected,
          isSelected && 'ms-DataListRow--Selected',
          className,
          {
            height: rowHeight
          }
        ) as string }
        data-selection-index={ index }
        data-is-focusable={ true }
        role='row'
      >
        { this._renderColumns(props) }
      </div>
    );
  }

  private _renderColumns(props: IDataListRowProps<TItem>): (JSX.Element | null)[] {
    const { columns } = props;

    return columns.map((column: IDataListColumn<TItem>, columnIndex: number) => {
      const {
        onRenderColumn = this._renderColumn
       } = column;

      return onRenderColumn(
        {
          row: props,
          column,
          columnIndex
        }, this._renderColumn);
    });
  }

  private _renderColumn: IRenderFunction<IDataListColumnRowProps<TItem>> = (props: IDataListColumnRowProps<TItem>): JSX.Element => {
    const {
      column,
      columnIndex,
      row
    } = props;

    const {
      key,
      isCollapsible,
      fieldName,
      minWidth,
      maxWidth,
      onRenderColumnContent = this._renderColumnContent
    } = column;

    const {
      item
    } = row;

    return (
      <div
        role='gridcell'
        aria-colindex={ columnIndex }
        key={ key }
        className={
          mergeStyles(
            'ms-DataList--Cell',
            stylesImport.cell,
            {
              minWidth,
              maxWidth,
              flexShrink: isCollapsible ? 1 : undefined
            }
          ) as string
        }
      >
        { onRenderColumnContent(props, this._renderColumnContent) }
      </div>
    );
  }

  private _renderColumnContent: IRenderFunction<IDataListColumnRowProps<TItem>>
  = (props: IDataListColumnRowProps<TItem>): JSX.Element => {
    const {
      column,
      row
    } = props;

    const {
      fieldName,
      key
    } = column;

    const {
      item
    } = row;

    return (
      <div className={ stylesImport.text }>
        { this._getValueFromColumn(item, fieldName || key) }
      </div>
    );
  }

  private _getValueFromColumn(item: TItem, key: string): string {
    // tslint:disable-next-line:no-any
    return (item as any)[key];
  }
}