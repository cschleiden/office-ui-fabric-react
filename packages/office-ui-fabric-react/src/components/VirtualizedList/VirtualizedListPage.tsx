import * as React from 'react';
import {
  ExampleCard,
  ComponentPage,
  IComponentDemoPageProps,
  PropertiesTableSet
} from '@uifabric/example-app-base';
import { VirtualizedListBasicExample } from './examples/VirtualizedList.Basic.Example';
import { FontClassNames } from '../../Styling';

const VirtualizedListBasicExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/VirtualizedList/examples/VirtualizedList.Basic.Example.tsx') as string;

export class VirtualizedListPage extends React.Component<IComponentDemoPageProps, {}> {
  public render() {
    return (
      <ComponentPage
        title='VirtualizedList'
        componentName='VirtualizedListExample'
        exampleCards={
          <ExampleCard title='VirtualizedList' code={ VirtualizedListBasicExampleCode }>
            <VirtualizedListBasicExample />
          </ExampleCard>
        }
        propertiesTables={
          <PropertiesTableSet
            sources={ [
              require<string>('!raw-loader!office-ui-fabric-react/src/components/VirtualizedList/VirtualizedList.Props.ts')
            ] }
          />
        }
        overview={
          <div>
          </div>
        }
        bestPractices={
          <div></div>
        }
        dos={
          <div>
          </div>
        }
        donts={
          <div>
          </div>
        }
        related={
          <a href='https://dev.office.com/fabric-js/Components/VirtualizedList/VirtualizedList.html'>Fabric JS</a>
        }
        isHeaderVisible={ this.props.isHeaderVisible }>
      </ComponentPage>
    );
  }
}
