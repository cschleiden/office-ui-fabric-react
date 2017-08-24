import * as React from 'react';
import { IColumnLayoutProvider, IColumn } from '../DataList.Props';
import { IItem } from '../List';

export class FlexColumnLayoutProvider<TItem extends IItem> implements IColumnLayoutProvider<TItem> {
  onResizeColumn(columnKey: string, newWidth: number): void {
    throw new Error("Method not implemented.");
  }

  renderColumn(column: IColumn): JSX.Element {
    return <div></div>;
  }
}