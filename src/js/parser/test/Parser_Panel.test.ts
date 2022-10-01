import {describe, expect, test, beforeEach, jest} from '@jest/globals'
import {test_instance} from '../../test/setup'
import InstanceState from '../../state/InstanceState'
import Parser_Panel from '../Parser_Panel'
import Panel from '../../components/Panel'
import { menu_html } from "../../test/fixtures/html_rendered_menu"
import PanelsContainer from '../../components/PanelsContainer'
import MenuItem from '../../components/MenuItem'
import MenuItemLink from '../../components/MenuItemLink'

describe('Parser_Panel', () => {

  let first_panel: Panel
  let sub_panel: Panel
  let panels_container: PanelsContainer
  let first_panel_element: HTMLElement
  let sub_panel_element: HTMLElement
  let parent_menu_item: MenuItem
  let parent_menu_link: MenuItemLink

  beforeEach(() => {

    document.body.innerHTML = menu_html

    panels_container = new PanelsContainer(test_instance.state)

    panels_container.element = document.querySelector(test_instance.state.options.selectors.panels_container)
    
    /* Get the first panel */
    first_panel_element = panels_container.element.querySelector(test_instance.state.options.selectors.panel)
    first_panel = new Panel(panels_container, test_instance.state);
    first_panel.depth = 0;
    first_panel.element = first_panel_element;

    /* And a sub panel with a menu item */
    sub_panel_element = first_panel.element.querySelector(test_instance.state.options.selectors.panel)
    sub_panel = new Panel(panels_container, test_instance.state);
    sub_panel.depth = 1;
    sub_panel.element = sub_panel_element;
    sub_panel.parent = first_panel;

    parent_menu_item = new MenuItem(test_instance.state)
    parent_menu_link = new MenuItemLink(test_instance.state)

    parent_menu_link.link = "http://example.com/destination"
    parent_menu_link.text = "Parent Menu Text"
    parent_menu_link.menu_item = parent_menu_item
    parent_menu_item.link = parent_menu_link

    sub_panel.menu_item_parent = parent_menu_item

    /* We don't want to recurse into menu item rendering here, so mock this function */
    jest.spyOn(Parser_Panel, "parsePanelMenuItems").mockImplementation(
      (panel: Panel, state: InstanceState) => {
        return
      }
    )

  });

  test('panels container element exists', () => {
    expect(panels_container.element).toBeInstanceOf(Element)
  })

  test('first panel element exists', () => {
    expect(first_panel.element).toBeInstanceOf(Element)
  })

  test('sub panel element exists', () => {
    expect(sub_panel.element).toBeInstanceOf(Element)
  })

  test('parser purposely ignores first panel title', () => {
    Parser_Panel.parsePanelTitle(first_panel, test_instance.state)

    const title_element = first_panel.element.querySelector(test_instance.state.options.selectors.panel_title)

    expect(title_element).toBeInstanceOf(Element)
    expect(title_element.innerHTML).toBe("")
   
  })

  test('parser applies panel title to sub panel', () => {
    Parser_Panel.parsePanelTitle(sub_panel, test_instance.state)

    const title_element = sub_panel.element.querySelector(test_instance.state.options.selectors.panel_title)

    expect(title_element).toBeInstanceOf(Element)
    expect(title_element.innerHTML).toBe(parent_menu_link.text)
  
  })


})