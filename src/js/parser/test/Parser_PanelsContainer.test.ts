import {describe, expect, test, beforeEach, jest} from '@jest/globals'
import {test_instance} from '../../test/setup'
import InstanceState from '../../state/InstanceState'
import Parser_PanelsContainer from '../Parser_PanelsContainer'
import Panel from '../../components/Panel'
import Parser_Panel from '../Parser_Panel'
import { menu_html } from "../../test/fixtures/html_rendered_menu"
import { DATA_ATTR_ELEMENT_ID } from '../../constants/constants'
import PanelsContainer from '../../components/PanelsContainer'

describe('Parser_PanelsContainer', () => {

  let panels_container_element: HTMLElement

  beforeEach(() => {

    document.body.innerHTML = menu_html

    panels_container_element = document.querySelector(test_instance.state.options.selectors.panels_container)

    test_instance.state.panels_container = null

    Parser_PanelsContainer.parse(panels_container_element, test_instance.state)

    /* We don't want to recurse into sub panel rendering here, so mock this function */
    jest.spyOn(Parser_Panel, "parse").mockImplementation(
      (panel: Panel, state: InstanceState) => {
        return
      }
    )

  });

  test('panels container is valid element', () => {
    expect(panels_container_element).toBeInstanceOf(Element)
  })

  test('state has panels container set', () => {
    expect(test_instance.state.panels_container).toBeInstanceOf(PanelsContainer)
  })

  test('panels container has at least one panel', () => {
    expect(test_instance.state.panels_container.panels.length).toBeGreaterThan(0)
  })

})