import React from "react";
import styled from "styled-components";
import {THEME_COLOR} from "./Constants";

export const Title = styled.h5`
  color: ${THEME_COLOR};
  font-weight: 900;
  font-size: 3em;
  margin: 0;
`

export const Emphasized = styled.span`
  font-weight: bold;
  color: ${THEME_COLOR}
`
