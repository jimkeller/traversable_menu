import { TraversableMenu } from "../core/traversable-core"
import { DATA_ATTR_ELEMENT_ID } from '../constants/constants'
import Renderer_PanelsContainer from "./Renderer_PanelsContainer"

export class Renderer {

  public static findElementByID(id : string): HTMLElement {
      return document.querySelector(`[${DATA_ATTR_ELEMENT_ID}="` + id.toString() + '"]')
  }

  public static render(instance : TraversableMenu) {
    return Renderer_PanelsContainer.render(instance.state.panels_container, instance.state)
  }

  /**
   * Calculate the height of an element based solely on its direct child elements
   * This is no longer in use as of v2.0 but leaving it here in case we do need it later.
   * @param {HTMLElement} element the element to calculate the height of
   * @returns {number} The height of the element
   */  
  /*
  public static heightCalculateBasedOnImmediateChildren (element: Element): number {

    let height = null
  
    if ( element ) {
  
      const children = Renderer.immediateChildren(element as HTMLElement)
      let scroll_height: number
      let child: Element
      
      height = 0
  
      for( let i = 0; i < children.length; i++ ) {
  
        child = children[i] as Element

        console.log('child element', child)

        scroll_height = child.scrollHeight
  
        if ( !scroll_height ) {
          //
          // Inline elements won't have scroll height - in this instance, default to getBoundingClientRect()
          //
          const bounding_box = child.getBoundingClientRect()
  
          if ( bounding_box && typeof(bounding_box.height) != 'undefined' ) {
            height += bounding_box.height
          }
        }
        else {
          height += scroll_height
        }
  
        const child_style = window.getComputedStyle(child)
  
        if ( child_style ) {
          height += ( child_style.marginTop != '' ) ? parseInt(child_style.marginTop) : 0 //height doesn't include margins
          height += ( child_style.marginBottom != '' ) ? parseInt(child_style.marginBottom) : 0

          height += ( child_style.marginBlockStart != '' ) ? parseInt(child_style.marginBlockStart) : 0 
          height += ( child_style.marginBlockEnd != '' ) ? parseInt(child_style.marginBlockEnd) : 0          
          
          if ( scroll_height ) {
            //
            // scroll height doesn't account for borders
            // @TODO: Neither does getBoundingClientRect() in a box model other than border-box
            //
            height += ( child_style.borderTopWidth != '' ) ? parseInt(child_style.borderTopWidth) : 0
            height += ( child_style.borderBottomWidth != '' ) ? parseInt(child_style.borderBottomWidth) : 0
          }
        }
      }
  
    }
  
    return height
  
  }
  */

  /**
   * Returns only the immediate children of an element; it will not traverse into
   * children of children even if they match the selector
   * @param {HTMLElement} container the element to find immediate children of
   * @param {string} [selector] optional selector to filter results by 
   * @returns {NodeList} matching nodes
   */
  public static immediateChildren(container : HTMLElement, selector?: string): NodeList {

    const container_context = ( container.parentElement ) ? container.parentElement : document
    let random_id : string

    if ( !container.getAttribute('id') ) {
      random_id = 'elem_id_' + (Math.floor(Math.random()*90000) + 10000).toString()
      container.setAttribute('id', random_id)
    }
    
    /*
     * Currently can't do direct child selectors like '>.sub-item'; prepending the element ID is a workaround.
    */
    let full_selector = '#' + container.getAttribute('id') + '>'
    full_selector += (selector) ? selector : '*'

    const children = container_context.querySelectorAll( full_selector )

    if ( random_id ) {
      container.removeAttribute('id')
    }

    return children
    
  }

}
