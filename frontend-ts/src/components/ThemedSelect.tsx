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
