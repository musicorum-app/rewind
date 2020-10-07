import React, {MouseEventHandler} from 'react';

import Button from '@material-ui/core/Button/Button';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles, Theme} from "@material-ui/core";
import {UserProfile} from "./api/interfaces";

const useStyles = makeStyles((theme: Theme) => createStyles({
  formBtn: {
    borderRadius: 50,
  },
  continueBtn: {
    borderRadius: 50,
    color: '#000'
  },
}))

const RoundedButton: React.FC<{
  onClick: MouseEventHandler<any>,
  fullWidth?: boolean,
  outlined?: boolean,
  color?: "primary" | "secondary",
  size?: "small" | "medium" | "large",
  style?: React.CSSProperties
}> = ({
        children,
        onClick,
        fullWidth,
        outlined,
        color,
        size,
        style
      }) => {
  outlined = outlined || false
  return <Button
    onClick={onClick}
    fullWidth={fullWidth}
    style={{
      borderRadius: 50,
      ...(!outlined ? {color: '#000'} : {}),
      ...(style || {})
    }}
    variant={outlined ? 'outlined' : 'contained'}
    color={color}
    size={size || "medium"}
  >
    {children}
  </Button>
}

export default RoundedButton
