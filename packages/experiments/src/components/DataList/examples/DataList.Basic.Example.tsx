import * as React from 'react';
import { IObjectWithKey, SelectionMode } from 'office-ui-fabric-react/lib/utilities/selection/index';
import { IColumn } from '../index';
import { DetailsDataList } from '../DetailsDataList';

interface IListItem extends IObjectWithKey {
  name: string;
  position: string;
  office: string;
  index: number;
}

// const items: IListItem[] = [];
// for (let i = 0; i < 300; ++i) {
//   items.push({
//     key: `item-${i}`,

//     column1: `Item ${i} c1`,
//     column2: `Item ${i} c2`,
//   });
// }

const positions = [
  'Accountant',
  'Developer',
  'Administrative Assistant',
  'Vice President',
  'Technical Fellow',
  'Development Manager',
  'Designer',
  'Program Manager'
];

const offices = ['Seattle', 'New York', 'Tokyo', 'California'];

function randWord(words: string[]): string {
  return words[Math.floor(Math.random() * words.length)];
}

const items: IListItem[] = [];

for (let i = 0; i < 100; i++) {
  items.push({
    key: 'item' + i,
    name: 'Item ' + i,
    position: randWord(positions),
    office: randWord(offices),
    index: i
  });
}

export class DataListBasicExample extends React.Component {
  public render(): JSX.Element {
    return (
      <div
        data-is-scrollable={ true }
        // tslint:disable-next-line:jsx-ban-props
        style={ {
          overflow: 'auto',
          height: '800px'
        } }
      >
        {
          React.createElement(
            DetailsDataList as { new(): DetailsDataList<IListItem> },
            {
              items,
              rowHeight: 30,
              selectionMode: SelectionMode.multiple,
              columns: [
                {
                  key: 'name',
                  name: 'Name',
                  fieldName: 'name',
                  minWidth: 200,
                  maxWidth: 300,
                  isResizable: true
                },
                {
                  key: 'position',
                  name: 'Position',
                  fieldName: 'position',
                  minWidth: 150,
                  maxWidth: 300,
                  isResizable: true
                },
                {
                  key: 'office',
                  name: 'Office',
                  fieldName: 'office',
                  minWidth: 100,
                  maxWidth: 300,
                  isCollapsible: true,
                  isResizable: true
                },
              ] as IColumn<IListItem>[]
            })
        }
      </div>
    );
  }
}
