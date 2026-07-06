// @flow
import React from 'react'
import { Icon } from 'antd'
import PopModal from '../../../../components/PopModal'
import styled from 'styled-components'

const ContactList = styled.ul`
  list-style-type: none;
  padding-left:0px;
`

const HelpPopoverContainer = styled.div`
  max-width: 300px;
  width:300px;
`

const ContactIcon = styled(Icon)`
  font-size:125%;
  padding-right:5px;
`

const Email = styled.span`
  font-family: courier;
  text-decoration: underline;
`

export default function HelpButton() {

  return (
    <PopModal
      title='Help/Contact'
      source={
        <span>
          <Icon type="question-circle" style={ { paddingRight: '4px' } } />
          Help/Contact
        </span>
      }
    >
      <HelpPopoverContainer>
        <p>Math3d.org is a work in progress. Have a question? Suggestion? Found a bug?</p>

        <p>Let us know!</p>

        <ContactList>
          <li>

            <ContactIcon type="github" />
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/ChristopherChudzicki/math3d-react/issues"
            >
              Open an issue on Github.
            </a>
          </li>
          <li>
            <ContactIcon type="mail" />
            Email <Email>math3dapp@gmail.com</Email>
          </li>
        </ContactList>
      </HelpPopoverContainer>
    </PopModal>
  )

}
