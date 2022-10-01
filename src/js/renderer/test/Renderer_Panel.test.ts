import {jest, describe, expect, test, beforeEach} from '@jest/globals'
import {test_instance} from '../../test/setup'
import Panel from '../../components/Panel'
import Renderer_Panel from '../Renderer_Panel'
import { Trigger_Top } from '../../components/Trigger'
import { DATA_ATTR_ELEMENT_ID } from '../../constants/constants'

describe('Panel Renderer', () => {
  let panel: Panel
  let panel_element: HTMLElement

  beforeEach(() => {
    panel = new Panel(test_instance.state.panels_container, test_instance.state)
  });

  test('panel outer HTML is rendered', () => {
    panel_element = Renderer_Panel.render(panel, test_instance.state)   
    expect(panel_element.outerHTML).not.toBeFalsy()
  })

  test('panel has ID attribute', () => {
    panel_element = Renderer_Panel.render(panel, test_instance.state)   
    expect(panel_element.getAttribute(DATA_ATTR_ELEMENT_ID)).not.toBeFalsy()
  })

  test('panel has proper class value', () => {
    panel_element = Renderer_Panel.render(panel, test_instance.state)   
    expect(panel_element.classList.contains(test_instance.state.options.classes.panel)).toBeTruthy()
  })

  test('panel height calculated using scrollHeight', () => {

    panel_element = Renderer_Panel.render(panel, test_instance.state)   
    const mock_height = 400

    jest.spyOn(panel_element, "scrollHeight", 'get').mockReturnValue(mock_height)

    const height = Renderer_Panel.calculateHeight(panel_element as HTMLElement, test_instance.state)

    expect(height).toEqual(mock_height)
  })

  test('top trigger renders', () => {
    const trigger_element = Renderer_Panel.renderTopTrigger(panel, test_instance.state)

    expect(panel.trigger_top).toBeInstanceOf(Trigger_Top)
    expect(trigger_element.getAttribute(DATA_ATTR_ELEMENT_ID)).not.toBeFalsy()
    expect(trigger_element.innerHTML).not.toBeFalsy()

  })
})