import {describe, expect, test} from '@jest/globals'
import {test_instance} from '../../test/setup'
import InstanceState from '../../state/InstanceState'
import {menu_item_data} from '../../test/fixtures/menu_item_data'
import PanelsContainer from '../../components/PanelsContainer'

describe('Traversable Core', () => {

  test('test instance is defined', () => {
    expect(test_instance).toBeDefined()
  })

  test('instance state is defined and correct instance', () => {
    expect(test_instance.state).toBeInstanceOf(InstanceState)
  })

  test('panel container can be initialized from data', () => {

    test_instance.initializeFromData(menu_item_data)

    expect(test_instance.state.panels_container).toBeInstanceOf(PanelsContainer)
    expect(test_instance.state.panels_container.id).not.toBeFalsy()
    expect(test_instance.state.panels_container.item_data).not.toBeFalsy() 
  })

  test('options should merge with defaults', () => {

    const test_selector = '.this-is-a-test-class'
    let new_options = { selectors: {panel: test_selector} }

    test_instance.optionsApply(new_options)

    expect(test_instance.state.options.selectors.panel).toEqual(test_selector)
    
    /* Also check for a default option we didn't change */
    expect(test_instance.state.options.selectors.panels_container).toEqual(".traversable-menu")
    
  })  

})