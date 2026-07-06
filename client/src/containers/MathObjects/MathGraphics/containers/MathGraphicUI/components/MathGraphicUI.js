// @flow
import * as React from 'react'
import MathObjectUI from '../../../../../../containers/MathObjects/MathObjectUI'
import { MainRow } from '../../../../../../containers/MathObjects/components'
import EvaluatedStatusSymbol from '../../../../../../containers/MathObjects/MathGraphics/containers/EvaluatedStatusSymbol'
import Settings from '../../../../../../containers/MathObjects/containers/Settings'
import { capitalize } from '../../../../../../utils/helpers'
import type { MetaData } from '../../../../../../containers/MathObjects/MathGraphics/types'
import styled from 'styled-components'

type Props = {
  id: string,
  type: string,
  children: React.Node,
  metadata: MetaData,
  settingsTitle?: string,
  isActive: boolean,
  isDeleteable?: boolean,
  sidePanelContent?: React.Node
}

function getSettingsFormSpec(metadata: MetaData) {
  return Object.keys(metadata)
    .filter(property => !metadata[property].isPrimary)
    .sort()
    .map(property => {
      const { inputType, label = property, allowEmpty } = metadata[property]
      return { property, inputType, label, allowEmpty }
    } )
}

const LeftOfSettings = styled.div`
  /* guarantee that settings has room to display */
  max-width: calc(100% - 30px);
  overflow-x: ${props => props.showOverflow ? 'visible' : 'hidden'};
  flex: 1;
`

export default class MathGraphicUI extends React.PureComponent<Props> {

  render() {
    const settingsTitle = this.props.settingsTitle === undefined
      ? `${capitalize(this.props.type)} Settings`
      : this.props.settingsTitle

    const sidePanelContent = this.props.sidePanelContent || (
      <EvaluatedStatusSymbol id={this.props.id} />
    )

    return (
      <MathObjectUI
        isDeleteable={this.props.isDeleteable}
        id={this.props.id}
        type={this.props.type}
        sidePanelContent={sidePanelContent}
      >
        <MainRow>
          <LeftOfSettings showOverflow={this.props.isActive}>
            {this.props.children}
          </LeftOfSettings>
          <Settings
            title={settingsTitle}
            parentId={this.props.id}
            settingsList={getSettingsFormSpec(this.props.metadata)}
          />
        </MainRow>
      </MathObjectUI>
    )
  }

}
