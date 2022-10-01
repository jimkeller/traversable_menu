import {describe, expect, test} from '@jest/globals'
import { DATA_ATTR_ELEMENT_ID } from '../../constants/constants'
import {test_instance} from '../../test/setup'
import ComponentIdentifier from "../ComponentIdentifier"

describe('ComponentIdentifier', () => {

  const ID_LEN = 15

  test('id not found on uninitialized element', () => {
    const element = document.createElement('div')
    expect(ComponentIdentifier.elementIDGet(element)).toBeNull()
  })

  test('valid ID returned by newID', () => {
    const new_id = ComponentIdentifier.newID()
    expect(new_id).not.toBeNull()
    expect(new_id).toHaveLength(ID_LEN)
  })

  test('ID automatically applied to element', () => {
    const element = document.createElement('div')
    ComponentIdentifier.elementApply(element)
    expect(element.getAttribute(DATA_ATTR_ELEMENT_ID)).toHaveLength(ID_LEN)
  })

  test('auto generated ID retrieved by elementIDGet', () => {
    const element = document.createElement('div')
    ComponentIdentifier.elementApply(element)
    expect(ComponentIdentifier.elementIDGet(element)).toHaveLength(ID_LEN)
  })  


  test('ID explicitly applied to element', () => {
    const new_id = ComponentIdentifier.newID()
    const element = document.createElement('div')
    ComponentIdentifier.elementApply(element, new_id)
    expect(element.getAttribute(DATA_ATTR_ELEMENT_ID)).toEqual(new_id)
  })

  test('ID explicitly retrieved by elementIDGet', () => {
    const element = document.createElement('div')
    const new_id = ComponentIdentifier.newID()
    ComponentIdentifier.elementApply(element, new_id)
    expect(ComponentIdentifier.elementIDGet(element)).toEqual(new_id)
  })



})