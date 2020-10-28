import React, {MouseEventHandler} from 'react';

import Button from '@material-ui/core/Button/Button';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles, Theme} from "@material-ui/core";
import {UserProfile} from "./api/interfaces";
import IconButton from "@material-ui/core/IconButton";

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
  onClick?: MouseEventHandler<any>,
  href?: string,
  fullWidth?: boolean,
  outlined?: boolean,
  color?: "primary" | "secondary",
  size?: "small" | "medium" | "large",
  style?: React.CSSProperties,
  disabled?: boolean
}> = ({
        children,
        onClick,
        fullWidth,
        outlined,
        color,
        size,
        style,
        disabled,
        href
      }) => {
  outlined = outlined || false
  // @ts-ignore
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
    disabled={disabled}
    href={href}
    target="_blank"
  >
    {children}
  </Button>
}

export default RoundedButton
