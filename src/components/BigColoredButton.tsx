import React, {MouseEventHandler} from 'react';

import Button from '@material-ui/core/Button/Button';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles, Theme} from "@material-ui/core";
import {THEME_COLOR} from "../Constants";
import {shadeColor} from "../utils";

const useStyles = (color: string, textColor?: string) => makeStyles((theme: Theme) => createStyles({
  button: {
    color: textColor || theme.palette.getContrastText(color),
    backgroundColor: color,
    '&:hover': {
      backgroundColor: shadeColor(color, -20)
    }
  }
}))

const BigColoredButton: React.FC<{
  onClick?: MouseEventHandler<any>,
  fullWidth?: boolean,
  color?: string,
  style?: React.CSSProperties
  icon?: React.ReactNode,
  textColor?: string,
  disabled?: boolean
}> = ({
        children,
        onClick,
        fullWidth,
        color,
        style,
        icon,
        textColor,
        disabled
      }) => {
  const {button} = useStyles(color || THEME_COLOR, textColor)()

  return <Button
    onClick={onClick || (() => {
    })}
    disabled={disabled}
    fullWidth={fullWidth}
    className={button}
    startIcon={icon}
    style={{
      fontSize: 27,
      borderRadius: 50,
      fontWeight: 700,
      paddingLeft: 40,
      paddingRight: 40,
      justifyContent: 'left',
      textTransform: 'none',
      ...(style || {})
    }}
    variant={'contained'}
  >
    {children}
  </Button>
}

export default BigColoredButton
