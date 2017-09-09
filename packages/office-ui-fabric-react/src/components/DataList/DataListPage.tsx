import * as React from 'react';
import {
  ExampleCard,
  IComponentDemoPageProps,
  ComponentPage,
  PropertiesTableSet
} from '@uifabric/example-app-base';
import { DataListBasicExample } from './examples/DataList.Basic.Example';

let DataListBasicExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/DataList/examples/DataList.Basic.Example.tsx') as string;

export class DataListPage extends React.Component<IComponentDemoPageProps, {}> {
  public render(): JSX.Element {
    return (
      <ComponentPage
        title='DataList'
        componentName='DataListExample'
        exampleCards={
          <ExampleCard title='DataList' code={ DataListBasicExampleCode }>
            <DataListBasicExample />
          </ExampleCard>
        }
        propertiesTables={
          <PropertiesTableSet
            sources={ [] }
          />
        }
        overview={
          <div>
            Stuff
          </div>
        }
        bestPractices={
          <div />
        }
        dos={
          <div>
            Stuff dos
          </div>
        }
        donts={
          <div />
        }
        related={
          <a href='https://dev.office.com/fabric-js/Components/Link/Link.html'>Fabric JS</a>
        }
        isHeaderVisible={ this.props.isHeaderVisible }
      />
    );
  }

}
