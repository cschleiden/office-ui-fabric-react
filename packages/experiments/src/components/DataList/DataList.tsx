import * as React from 'react';
import { BaseComponent, IBaseProps, css, IRenderFunction, autobind } from 'office-ui-fabric-react/lib/Utilities';
import { ISelection, Selection, SelectionZone, SelectionMode } from 'office-ui-fabric-react/lib/utilities/selection';
import { FocusZone, FocusZoneDirection } from 'office-ui-fabric-react/lib/FocusZone';
import { IItem, IListProps } from './List';
import { StaticList } from './StaticList';
import { DataListRow } from './DataListRow';
import { DataListHeader } from './DataListHeader';
import { IDataListProps, IDataListListProps } from 'src/components/DataList/DataList.Props';

import * as stylesImport from './DataList.scss';
const styles: any = stylesImport;

export class DataList<TItem extends IItem = any> extends BaseComponent<IDataListProps<TItem>, {}> {
  private container: HTMLElement;

  private selection: ISelection;
  private start = 0;

  constructor(props: IDataListProps<TItem>, context: any) {
    super(props, context);

    this.selection = new Selection();
    this.selection.setItems(this.props.items, true);
  }

  public render(): JSX.Element {
    const {
      items,
      itemHeight,
      columns,
      onRenderList = this._renderList
     } = this.props;

    return <div
      className={ css(
        'ms-DataList'
      ) }
      ref={ this._resolveRef('container') }>

      <DataListHeader columns={ columns } itemHeight={ itemHeight } />

      <FocusZone
        ref={ this._resolveRef('_focusZone') }
        className={ stylesImport.focusZone }
        direction={ FocusZoneDirection.vertical }
        isInnerZoneKeystroke={ () => false }
      >
        <SelectionZone
          ref={ this._resolveRef('_selectionZone') }
          selection={ this.selection }
          selectionPreservedOnEmptyClick={ true }
          selectionMode={ SelectionMode.single }
        >

          { onRenderList(
            {
              items,
              itemHeight,
              className: 'ms-DataListList',
              onRenderItem: this._renderRow
            }) }

        </SelectionZone>
      </FocusZone>
    </div>;
  }

  public componentWillMount() {
    performance.mark('control-start');
    this.start = performance.now();
  }

  public componentDidMount() {
    performance.mark('control-end');
    performance.measure('control', 'control-start', 'control-end');

    console.log(`DataList rendering ${performance.now() - this.start}ms`);
  }

  @autobind
  private _renderList(listProps: IDataListListProps<TItem>) {
    return <StaticList
      {...listProps}
    />;
  }

  @autobind
  private _renderRow(item: TItem, index: number): (JSX.Element | null) {
    const { itemHeight, columns } = this.props;

    return React.createElement(
      DataListRow as { new(): DataListRow<TItem> },
      {
        columns,
        index,
        item,
        itemHeight,
        selection: this.selection,
        key: item.key
      });
  }
}
