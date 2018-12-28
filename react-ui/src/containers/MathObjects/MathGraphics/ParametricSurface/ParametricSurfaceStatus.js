// @flow
import React from 'react'
import EvaluatedStatusSymbol from '../containers/EvaluatedStatusSymbol'
import { colors, colorMaps } from 'constants/colors'
import { Tabs } from 'antd'

const TabPane = Tabs.TabPane

const extendedColors = [...colors, ...Object.keys(colorMaps)]

type Props = {
  id: string
}

export default function ParametricSurfaceStatus(props: Props) {
  return (
    <EvaluatedStatusSymbol
      colors={extendedColors}
      id={props.id}
      extraTabs={
        <TabPane tab='Color Map' key='colormap'>
          Hello
        </TabPane>
      }
    />
  )
}
