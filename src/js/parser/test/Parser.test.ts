import {describe, expect, test, beforeEach, jest} from '@jest/globals'
import {test_instance} from '../../test/setup'
import InstanceState from '../../state/InstanceState'
import Parser from '../Parser'
import Parser_PanelsContainer from '../Parser_PanelsContainer'
import { menu_html } from "../../test/fixtures/html_rendered_menu"

describe('Parser', () => {

  beforeEach(() => {

    document.body.innerHTML = menu_html

    /* We don't want to recurse into sub panel rendering here, so mock this function */
    jest.spyOn(Parser_PanelsContainer, "parse").mockImplementation(
      (panels_container_element: HTMLElement, state: InstanceState) => {
        return
      }
    )

  });

  test('panels container exists in test data', () => {
    expect(document.querySelector(test_instance.state.options.selectors.panels_container)).toBeInstanceOf(Element)
  })

  test('parser finds panels container', () => {
    expect(Parser.parse(test_instance.state.options.selectors.panels_container, test_instance.state)).not.toEqual(false)
  })

  test('returns false if no container found', () => {
    document.body.innerHTML = ""
    expect(Parser.parse(test_instance.state.options.selectors.panels_container, test_instance.state)).toEqual(false)
  })  

})