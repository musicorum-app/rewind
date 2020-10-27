import React, {useEffect, useState} from "react";
import {FullScreenHandle} from "react-full-screen";
import Dialog from "@material-ui/core/Dialog";
import {TransitionProps} from "@material-ui/core/transitions";
import Slide from "@material-ui/core/Slide";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogContent from "@material-ui/core/DialogContent";
import {List} from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {hasOrientationSensor} from "../utils";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Switch from "@material-ui/core/Switch";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import {useTranslation} from "react-i18next";
import {langs} from "../locales";

const Transition = React.forwardRef((
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
  ) => <Slide direction="up" ref={ref} {...props} />
)

const ConfigDialog: React.FC<{
  open: boolean,
  onClose: () => void,
  showGyro?: boolean,
  useSensor?: boolean,
  onSensorChange?: (use: boolean) => void
}> = ({open, onClose, useSensor, onSensorChange, showGyro}) => {
  const {t, i18n } = useTranslation()
  const [hasSensorSupport, setSensorSupport] = useState(false)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  useEffect(() => {
    hasOrientationSensor()
      .then(has => setSensorSupport(has))
  }, [])

  const handleChangeSensor = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onSensorChange) onSensorChange(event.target.checked)
  }

  const clearCache = () => {
    localStorage.removeItem('cache')
    localStorage.removeItem('image.storyShare')
    localStorage.removeItem('image.playlist')
    localStorage.removeItem('image.albumMeme')
    localStorage.removeItem('image.normalShare')
    window.location.reload()
  }


  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event: React.MouseEvent<HTMLElement>, lang: string) => {
    i18n.changeLanguage(lang)
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getLang = () => {
    return langs[i18n.language]
  }

  return <Dialog
    TransitionComponent={Transition}
    keepMounted
    fullWidth
    maxWidth="xs"
    open={open}
    onClose={onClose}
  >
    <DialogTitle>
      <b>{t('config.title')}</b>
    </DialogTitle>
    <DialogContent>
      {/*<DialogContentText>*/}

      <List>
        <ListItem button onClick={handleClickListItem}>
          <ListItemText
            primary={<b>{t('config.language')}</b>}
            secondary={getLang()}
          />
        </ListItem>
        {
          showGyro
            ? [
              <Divider/>,
              <ListItem disabled={!hasSensorSupport}>
                <ListItemText primary={<b>{t('config.sensor')}</b>}/>
                <ListItemSecondaryAction>
                  <Switch
                    value={useSensor}
                    onChange={handleChangeSensor}
                    disabled={!hasSensorSupport}
                    edge="end"
                  />
                </ListItemSecondaryAction>
              </ListItem>
            ]
            : null
        }
        <Divider/>
        <ListItem>
          <Button color="primary" onClick={clearCache}>
            {t('config.clearCache')}
          </Button>
        </ListItem>
      </List>
      {/*</DialogContentText>*/}
    </DialogContent>

    <Menu
      style={{
        minWidth: 200
      }}
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
        <MenuItem
          selected={i18n.language === 'en'}
          onClick={(event) => handleMenuItemClick(event, 'en')}
        >
          English
        </MenuItem>
      <MenuItem
        selected={i18n.language === 'pt'}
        onClick={(event) => handleMenuItemClick(event, 'pt')}
      >
        Português
      </MenuItem>
    </Menu>

  </Dialog>
}

export default ConfigDialog