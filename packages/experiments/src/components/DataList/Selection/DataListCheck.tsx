import * as React from 'react';
import { css } from 'office-ui-fabric-react/lib/Utilities';
import { Check } from 'office-ui-fabric-react/lib/Check';

import * as styles from './DataListCheck.scss';

export interface IDataListCheckProps {
  canSelect: boolean;

  selected: boolean;

  anySelected: boolean;
}

export function dataListCheck(props: IDataListCheckProps): JSX.Element {
  const {
      selected
    } = props;

  const isPressed = selected;

  return (
    <button
      role='checkbox'
      className={
        css(
          'ms-DataListCheck',
          styles.root
        )
      }
    >
      <Check checked={ isPressed } />
    </button >
  );
}