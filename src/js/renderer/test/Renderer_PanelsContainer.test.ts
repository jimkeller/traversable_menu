import {describe, expect, test, beforeEach} from '@jest/globals'
import {test_instance} from '../../test/setup'
import PanelsContainer from '../../components/PanelsContainer'
import { DATA_ATTR_ELEMENT_ID } from '../../constants/constants'
import Renderer_PanelsContainer from '../Renderer_PanelsContainer'

describe('Panel Renderer', () => {
  let panel_container: PanelsContainer
  let panel_container_element: HTMLElement

  beforeEach(() => {
    panel_container = new PanelsContainer(test_instance.state)
    panel_container_element = Renderer_PanelsContainer.render(panel_container, test_instance.state)   
  });

  test('panel container outer HTML is rendered', () => {
    expect(panel_container_element.outerHTML).not.toBeFalsy()
  })

  test('panel container has ID attribute', () => {
    expect(panel_container_element.getAttribute(DATA_ATTR_ELEMENT_ID)).not.toBeFalsy()
  })

  test('panel container has proper class value', () => {
    expect(panel_container_element.classList.contains(test_instance.state.options.classes.panels_container)).toBeTruthy()
  })
})