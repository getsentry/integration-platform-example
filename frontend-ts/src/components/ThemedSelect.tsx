import {useTheme} from '@emotion/react';
import React from 'react';
import Select, {Props} from 'react-select';

const ThemedSelect = (props: Props<any>) => {
  const theme = useTheme();
  return (
    <Select
      theme={defaultTheme => ({
        ...defaultTheme,
        colors: {
          ...defaultTheme.colors,
          neutral0: theme.surface200,
          neutral80: theme.gray500,
          primary: theme.blue400,
          primary75: theme.blue300,
          primary50: theme.blue200,
          primary25: theme.blue100,
        },
      })}
      {...props}
    />
  );
};

export default ThemedSelect;
export type OptionType = {value: string; label: string};
