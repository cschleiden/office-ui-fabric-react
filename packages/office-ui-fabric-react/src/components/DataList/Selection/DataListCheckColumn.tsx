import * as React from 'react';

import { IDataListColumn, IDataListColumnRowProps, IDataListItem } from '../DataList.Props';
import { dataListCheck } from './DataListCheck';
import {
  css
} from '../../../Utilities';

import * as rowStyles from '../../DetailsList/DetailsRow.scss';

export class DataListCheckColumn<TItem extends IDataListItem> implements IDataListColumn<TItem> {
  public readonly key: string = 'ms-DataList-CheckColumn';
  public readonly name: string = '';
  public readonly fieldName: string = '__dataListCheck';
  public readonly minWidth: number = 20;
  public readonly maxWidth: number = 20;
  public readonly isCollapsible?: boolean = false;
  public readonly isResizable?: boolean = false;

  public onRenderColumn(
    columnRowProps: IDataListColumnRowProps<TItem>, defaultRender: (props: IDataListColumnRowProps<TItem>) => JSX.Element): JSX.Element {
    const {
      columnIndex,
      row
    } = columnRowProps;

    const {
      index,
      selection
    } = row;

    const selected = selection.isIndexSelected(index);
    const anySelected = selection.getSelectedCount() > 0;

    return (
      <div
        role='gridcell'
        aria-colindex={ columnIndex }
        data-selection-toggle={ true }
        key='ms-DataList-CheckCell'
        className={ css(
          rowStyles.cell,
          rowStyles.checkCell
        ) }
      >
        {
          dataListCheck({
            anySelected,
            canSelect: true,
            selected
          })
        }
      </div>
    );
  }
}
