import {useTheme} from '@emotion/react';
import React from 'react';
import Select, {Props} from 'react-select';

const ThemedSelect = (props: Props) => {
  const theme = useTheme();
  return (
    <Select
      theme={defaultTheme => ({
        ...defaultTheme,
        colors: {
          ...defaultTheme.colors,
          primary: theme.purple400,
          primary75: theme.purple300,
          primary50: theme.purple200,
          primary25: theme.purple100,
        },
      })}
      {...props}
    />
  );
};

export default ThemedSelect;
