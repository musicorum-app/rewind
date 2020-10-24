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

const Transition = React.forwardRef((
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
  ) => <Slide direction="up" ref={ref} {...props} />
)

const ConfigDialog: React.FC<{
  open: boolean,
  onClose: () => void
}> = ({open, onClose}) => {
  const [hasSensorSupport, setSensorSupport] = useState(false)
  // const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  // const [selectedIndex, setSelectedIndex] = React.useState(1);

  useEffect(() => {
    hasOrientationSensor()
      .then(has => setSensorSupport(has))
  }, [])

  return <Dialog
    TransitionComponent={Transition}
    keepMounted
    fullWidth
    maxWidth="md"
    open={open}
    onClose={onClose}
  >
    <DialogTitle>
      <b>Configuration</b>
    </DialogTitle>
    <DialogContent>
      {/*<DialogContentText>*/}
        <List>
          <ListItem button>
            <ListItemText
              primary={<b>Language</b>}
              secondary="English"
            />
          </ListItem>
          <Divider variant="inset" />
          <ListItem disabled={!hasSensorSupport}>
            <ListItemText primary={<b>Use orientation sensor</b>} />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      {/*</DialogContentText>*/}
    </DialogContent>
  </Dialog>
}

export default ConfigDialog