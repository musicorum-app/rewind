import React, {useEffect} from "react"
import CircularProgress from "@material-ui/core/CircularProgress"
import styled from "styled-components";
import {Typography} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import {WindowType} from "../api/interfaces";
import DeezerAPI from "../api/DeezerAPI";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

export default function DeezerCallback() {

  useEffect(() => {
    connect()
  }, [])

  const connect = async () => {
    const { hash } = window.location
    if (!hash) return
    const token = new URLSearchParams(hash.slice(1)).get('access_token')
    if (!token) return

    const deezer = new DeezerAPI(token)
    const profile = await deezer.getMe()
    console.log(profile)

    if (!window.opener) return
    const win: WindowType = window.opener as unknown as WindowType
    win.connect(token, {
      id: profile.id + '',
      name: profile.firstname + profile.lastname,
      username: profile.name,
      image: profile.picture_medium
    })

    window.close()
  }

  return <Wrapper>
    <Typography variant="h3" component="p">
      <b>Loading...</b>
    </Typography>
    <Box mt={5}>
      <CircularProgress size={60} />
    </Box>
  </Wrapper>
}