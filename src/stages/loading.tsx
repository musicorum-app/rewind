import React, {forwardRef, useImperativeHandle, useState} from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles, Theme} from "@material-ui/core";
import {RewindData, UserProfile} from "../api/interfaces";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import LinearProgress from "@material-ui/core/LinearProgress";
import Container from "@material-ui/core/Container";
import dataFetcher from "../api/dataFetcher";
import moment from "moment";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import RoundedButton from "../RoundedButton";
import {VERSION} from "../Constants";

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    position: 'absolute',
    left: 0,
    top: 0
  }
}))

interface RewindCache {
  data: RewindData,
  cachedAt: number
}

const LoadingStage: React.FC<{
  user: UserProfile,
  onComplete: (data: RewindData) => void,
  ref: React.Ref<HTMLDivElement>
}> = forwardRef(({user, onComplete}, ref) => {
  const [progress, setProgress] = useState(0)
  const [progressText, setProgressText] = useState('Loading...')
  const [rewindData, setRewindData] = useState<RewindData | null>(null)
  const [cacheData, setCacheData] = useState<RewindCache | null>(null)

  const load = async () => {
    const cache = localStorage.getItem('cache')
    if (cache) {
      try {
        const data: RewindCache = JSON.parse(cache)
        data.data.firstTrack.listenedAt = new Date(data.data.firstTrack.listenedAt)
        if (data.data.user.name !== user.name) throw new Error('Username mismatch')
        setCacheData(data)
      } catch (e) {
        console.error(e)
        fetchData()
      }
    } else {
      fetchData()
    }
  }

  const fetchData = async () => {
    const data = await dataFetcher(user, (pgr, text) => {
      setProgress(prevState => pgr ? pgr : prevState)
      setProgressText(text)
    })
    console.log(data);
    setRewindData(data)
    localStorage.setItem('cache', JSON.stringify({
      cachedAt: new Date().getTime(),
      data,
      _v: VERSION
    }))
    onComplete(data)
  }

  // @ts-ignore
  useImperativeHandle(ref, () => ({
    load
  }))

  const getFormatted = (d: number) => moment(d).format('MMM Do')

  const fetchAgain = () => {
    setCacheData(null)
    localStorage.removeItem('cache')
    fetchData()
  }

  const complete = () => {
    if (cacheData?.data)
      onComplete(cacheData?.data)
  }

  const styles = useStyles()
  return <>
    <div className={styles.root}>
      <Box mx={3}>
        <Container maxWidth="sm">
          {
            cacheData ? <>
                <Typography component="h5" variant="h5">
                  <Box fontWeight={600}>We found out a past rewind.</Box>
                </Typography>
                <br/>
                <Typography>You already used Musicorum Rewind
                  at <strong>{getFormatted(cacheData.cachedAt)}</strong></Typography>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar style={{
                      width: 50,
                      height: 50
                    }} src={cacheData.data.user.image[3]["#text"]}/>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Box component="span" color="primary.main">
                      {cacheData.data.user.realname}
                    </Box>}
                    secondary={'@' + cacheData.data.user.name}
                  />
                </ListItem>
                <Box my={2}>
                  <RoundedButton onClick={complete} fullWidth color="primary">
                    Continue
                  </RoundedButton>
                  <Box mt={1}>
                    <RoundedButton onClick={fetchAgain} outlined fullWidth color="primary">
                      Fetch again
                    </RoundedButton>
                  </Box>
                </Box>
              </>
              : <>
                <Typography component="h4" variant="h4">
                  <Box fontWeight={700}>Loading...</Box>
                </Typography>
                <br/>
                <Typography>Dont mind, we are just grabbing your entire 2020 on music...</Typography>
                <Box mt={5}>
                  <Typography color="textSecondary">{progressText}</Typography>
                  <LinearProgress variant="determinate" value={progress}/>
                </Box>
              </>
          }
        </Container>
      </Box>
    </div>
  </>
})

export default LoadingStage
