import * as React from 'react';
import { IObjectWithKey } from 'office-ui-fabric-react/lib/utilities/selection/index';
import { IColumnLayoutProvider, IColumn } from '../DataList.Props';

export class FlexColumnLayoutProvider<TItem extends IObjectWithKey> implements IColumnLayoutProvider<TItem> {
  public onResizeColumn(columnKey: string, newWidth: number): void {
    throw new Error('Method not implemented.');
  }

  public renderColumn(column: IColumn<TItem>): JSX.Element {
    return <div />;
  }
}