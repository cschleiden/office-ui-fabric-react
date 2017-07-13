/* tslint:disable:no-unused-variable */
import * as React from 'react';
/* tslint:enable:no-unused-variable */
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import {
  DetailsList,
  DetailsListLayoutMode,
  IDetailsHeaderProps,
  Selection,
  IColumn,
  ConstrainMode
} from 'office-ui-fabric-react/lib/DetailsList';
import {
  IRenderFunction,
  IRectangle
} from 'office-ui-fabric-react/lib/Utilities';
import {
  TooltipHost,
  ITooltipHostProps
} from 'office-ui-fabric-react/lib/Tooltip';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';

let _items = [];

let _columns: IColumn[] = [
  {
    key: 'column1',
    name: 'Name',
    fieldName: 'name',
    minWidth: 100,
    maxWidth: 200,
    isResizable: true,
    ariaLabel: 'Operations for name'
  },
  {
    key: 'column2',
    name: 'Value',
    fieldName: 'value1',
    minWidth: 100,
    maxWidth: 200,
    isResizable: true,
    ariaLabel: 'Operations for value'
  },
  {
    key: 'column3',
    name: 'Value',
    fieldName: 'value2',
    minWidth: 100,
    maxWidth: 200,
    isResizable: true,
    ariaLabel: 'Operations for value'
  },
  {
    key: 'column4',
    name: 'Value',
    fieldName: 'value3',
    minWidth: 100,
    maxWidth: 200,
    isResizable: true,
    ariaLabel: 'Operations for value'
  },
  {
    key: 'column5',
    name: 'Value',
    fieldName: 'value4',
    minWidth: 100,
    maxWidth: 200,
    isResizable: true,
    ariaLabel: 'Operations for value'
  },
];

let start = 0;

export class DetailsListBasicExample extends React.Component<any, any> {
  private _selection: Selection;

  constructor() {
    super();

    // Populate with items for demos.
    if (_items.length === 0) {
      for (let i = 0; i < 1000; i++) {
        _items.push({
          key: i,
          name: 'Item ' + i,
          value1: i + '',
          value2: 'asdf' + i,
          value3: '123' + i,
          value4: i + '123123'
        });
      }
    }

    this._selection = new Selection({
      onSelectionChanged: () => this.setState({ selectionDetails: this._getSelectionDetails() })
    });

    this.state = {
      items: _items,
      selectionDetails: this._getSelectionDetails()
    };
  }

  public render() {
    let { items, selectionDetails } = this.state;

    return (
      <div>
        <div>{ selectionDetails }</div>
        <TextField
          label='Filter by name:'
          onChanged={ text => {
            start = window.performance.now();

            this.setState({
              items: text ? _items.filter(i => {
                return [
                  i.name,
                  i.value1,
                  i.value2,
                  i.value3,
                  i.value4
                ].some(x => x.toLowerCase().indexOf(text) > -1);
              }) : _items
            });
          } }
        />
        <MarqueeSelection selection={ this._selection }>
          <DetailsList
            items={ items }
            columns={ _columns }
            setKey='set'
            layoutMode={ DetailsListLayoutMode.fixedColumns }
            constrainMode={ ConstrainMode.unconstrained }
            onRenderDetailsHeader={
              (detailsHeaderProps: IDetailsHeaderProps, defaultRender: IRenderFunction<IDetailsHeaderProps>) => defaultRender({
                ...detailsHeaderProps,
                onRenderColumnHeaderTooltip: (tooltipHostProps: ITooltipHostProps) => <TooltipHost { ...tooltipHostProps } />
              })
            }
            selection={ this._selection }
            selectionPreservedOnEmptyClick={ true }
            ariaLabelForSelectionColumn='Toggle selection'
            ariaLabelForSelectAllCheckbox='Toggle selection for all items'
            onItemInvoked={ (item) => alert(`Item invoked: ${item.name}`) }
            onDidUpdate={ () => {
              console.log(`setState until componentDidUpdate took ${window.performance.now() - start}`);
            } }
            listProps={ {
              getPageHeight: () => 36 * 10
            } }
          />
        </MarqueeSelection>
      </div>
    );
  }

  private _getSelectionDetails(): string {
    let selectionCount = this._selection.getSelectedCount();

    switch (selectionCount) {
      case 0:
        return 'No items selected';
      case 1:
        return '1 item selected: ' + (this._selection.getSelection()[0] as any).name;
      default:
        return `${selectionCount} items selected`;
    }
  }
}
