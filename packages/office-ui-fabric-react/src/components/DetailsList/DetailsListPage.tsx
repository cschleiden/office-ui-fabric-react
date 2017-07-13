import * as React from 'react';
import { Link } from 'office-ui-fabric-react/lib/Link';
import {
  ExampleCard,
  IComponentDemoPageProps,
  ComponentPage,
  PropertiesTableSet
} from '@uifabric/example-app-base';
import { DetailsListBasicExample } from './examples/DetailsList.Basic.Example';
const DetailsListBasicExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/DetailsList/examples/DetailsList.Basic.Example.tsx') as string;

import { DetailsListCustomColumnsExample } from './examples/DetailsList.CustomColumns.Example';
const DetailsListCustomColumnsExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/DetailsList/examples/DetailsList.CustomColumns.Example.tsx') as string;

import { DetailsListCustomRowsExample } from './examples/DetailsList.CustomRows.Example';
const DetailsListCustomRowsExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/DetailsList/examples/DetailsList.CustomRows.Example.tsx') as string;

import { DetailsListCustomGroupHeadersExample } from './examples/DetailsList.CustomGroupHeaders.Example';
const DetailsListCustomGroupHeadersExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/DetailsList/examples/DetailsList.CustomGroupHeaders.Example.tsx') as string;

import { DetailsListAdvancedExample } from './examples/DetailsList.Advanced.Example';
const DetailsListAdvancedExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/DetailsList/examples/DetailsList.Advanced.Example.tsx') as string;

import { DetailsListGroupedExample } from './examples/DetailsList.Grouped.Example';
const DetailsListGroupedExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/DetailsList/examples/DetailsList.Grouped.Example.tsx') as string;

import { DetailsListDragDropExample } from './examples/DetailsList.DragDrop.Example';
const DetailsListDragDropExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/DetailsList/examples/DetailsList.DragDrop.Example.tsx') as string;

import { DetailsListNavigatingFocusExample } from './examples/DetailsList.NavigatingFocus.Example';
const DetailsListNavigatingFocusExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/DetailsList/examples/DetailsList.NavigatingFocus.Example.tsx') as string;

export class DetailsListPage extends React.Component<IComponentDemoPageProps, {}> {
  public render() {
    return (
      <ComponentPage
        title='DetailsList'
        componentName='DetailsListExample'
        exampleCards={
          <div>
            <ExampleCard title='Simple DetailsList with 500 items, filtering, marquee selection' isOptIn={ true } code={ DetailsListBasicExampleCode }>
              <DetailsListBasicExample />
            </ExampleCard>
          </div>
        }
        propertiesTables={
          <PropertiesTableSet
            sources={ [
              require<string>('!raw-loader!office-ui-fabric-react/src/components/DetailsList/DetailsList.Props.ts')
            ] }
          />
        }
        overview={
          <div>
          </div>
        }
        isHeaderVisible={ this.props.isHeaderVisible }>
      </ComponentPage>
    );
  }
}
