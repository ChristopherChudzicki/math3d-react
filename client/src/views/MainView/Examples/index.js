import React from 'react'
import Drawer from '../../../containers/Drawer'
import ControlledTabs, { TabPane } from '../../../containers/ControlledTabs'
import ExamplesList from './ExamplesList'
import { neatExamples, featureDemos } from './data'

const Examples = (props) => {
  return (
    <Drawer id='examples' slideTo='right'>
      <ControlledTabs id='examples'>
        <TabPane key='1' tab='Feature Demos'>
          <ExamplesList data={featureDemos}/>
        </TabPane>
        <TabPane key='2' tab='Neat Examples'>
          <ExamplesList data={neatExamples}/>
        </TabPane>
      </ControlledTabs>
    </Drawer>
  )
}

export default Examples
