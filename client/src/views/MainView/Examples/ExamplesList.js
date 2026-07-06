// @flow
import React from 'react'
import type { Examples, ExampleItem } from './data'
import { NavLink } from 'react-router-dom'

type Props = {
  data: Examples
}

export default function ExamplesList(props: Props) {
  const { data } = props
  return (
    <ul>
      {
        data.map((example: ExampleItem, index: number) => {
          return (
            <li key={index}>
              <NavLink to={`?${example.id}.json`}>
                {example.title}
              </NavLink>
              {example.description}
            </li>
          )
        } )
      }
    </ul>
  )
}
