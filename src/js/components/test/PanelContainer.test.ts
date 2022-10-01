import {describe, expect, test} from '@jest/globals'
import { test_instance } from '../../test/setup'
import PanelsContainer from '../PanelsContainer'
import Panel from '../Panel'
import {menu_item_data} from '../../test/fixtures/menu_item_data'

describe('PanelContainer', () => {
 
  const panel_container = new PanelsContainer(test_instance.state)

  test('has id', () => {
    expect(panel_container.id).not.toEqual(null)
  })

  test('panel container initializeFromData function exists', () => {
    expect(panel_container.initializeFromData).toBeInstanceOf(Function)
  })

  panel_container.initializeFromData(menu_item_data)

  test('can initialize with item data set as member', () => {
    expect(panel_container.panels.length).toBe(2)
  })

  test('can add a panel', () => {
    const panel = new Panel(panel_container, test_instance.state)
    panel_container.addPanel(panel);
    expect(panel_container.panels.length).toBe(3);
  })

  test('valid item data validates', () => {
    expect(panel_container.validateItemData(menu_item_data)).toBeTruthy()
  })

  test('invalid item data does not validate', () => {
    const invalid_item_data = {
      'some_key': {
        'not valid': 'invalid data'
      }
    } 

    expect(panel_container.validateItemData(invalid_item_data as any)).toBeFalsy()
  })

  test('can reset panels', () => {
    panel_container.panelsReset()
    expect(panel_container.panels.length).toBe(0)
  })

  test('can initialize panel from item data', () => {
    const panel = new Panel(panel_container, test_instance.state)
    panel_container.panelsReset()
    panel_container.panelInitializeFromData(panel, menu_item_data.items)
    expect(panel_container.panels.length).toBe(2);
  })

  test('can initialize again from data without extra panels', () => {
    panel_container.initializeFromData(menu_item_data)
    expect(panel_container.panels.length).toBe(2);
  }) 
})