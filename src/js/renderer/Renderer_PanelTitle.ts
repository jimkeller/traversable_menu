import Panel from "../components/Panel"
import InstanceState from "../state/InstanceState"
import Tokenizer from "../utils/tokenizer"
import { TOKEN_MENU_TITLE } from "../constants/constants"

export default class Renderer_PanelTitle {

  public static render(panel: Panel, state: InstanceState): HTMLElement | null {
    
    if (Renderer_PanelTitle.shouldShow(panel, state)) {
      const title_element = document.createElement(state.options.panel.title_element)
      const link_element = Renderer_PanelTitle.renderLink(title_element, panel, state)
      
      if (link_element) {
        Renderer_PanelTitle.applyText(link_element, panel, state)
        title_element.appendChild(link_element)
      }
      else {
        Renderer_PanelTitle.applyText(title_element, panel, state)
      }

      Renderer_PanelTitle.applyAttributes(title_element, state)
    
      return title_element
    }

    return null
  }

    /**
     * Determines whether this panel should have a title
     * 
     * @param {Panel} panel The panel to find a title for
     * @param {InstanceState} state State object for this instance
     * @return {boolean} true if the panel should show a title, false if not
     */
    public static shouldShow(panel: Panel, state: InstanceState): boolean {

    if (panel.depth == 0 && state.options.panel.title_first != "" ) {
      return true
    }
    else {
      if (panel.menu_item_parent && panel.menu_item_parent.link && panel.menu_item_parent.link.text) {
        return true
      }
    }
    
    return false
    }

  /**
   * If a title element exists in the HTML for this panel, apply any necessary logic
   * to update the title text at runtime (e.g. if an explicit title for the first panel is set in the options)
   * 
   * @param panel The panel to find a title for
   * @param state State object for this instance
   */
   public static applyText(panel_title_element: HTMLElement, panel: Panel, state: InstanceState): void {
  
    if (panel_title_element) {
      if (panel.depth == 0 && panel_title_element.innerHTML == "" ) {
        panel_title_element.innerHTML = state.options.panel.title_first
      }
      else {
        if (panel.menu_item_parent && panel.menu_item_parent.link && panel.menu_item_parent.link.text)
        panel_title_element.innerHTML = Tokenizer.replace(state.options.panel.title_text, TOKEN_MENU_TITLE, panel.menu_item_parent.link.text)
      }
    }
   }
  
  public static renderLink(panel_title_element: HTMLElement, panel: Panel, state: InstanceState): HTMLElement | null {

    let link_element

    if (panel_title_element) {
      if (panel.menu_item_parent && panel.menu_item_parent.link && panel.menu_item_parent.link.link) {
        link_element = document.createElement('a')  
        Renderer_PanelTitle.applyLinkAttributes(link_element, panel, state)
      }
    }  
    
    return link_element || null
    
  }

  public static applyLinkAttributes(link_element: HTMLElement, panel: Panel, state: InstanceState): void {
    
    if (panel.menu_item_parent && panel.menu_item_parent.link && panel.menu_item_parent.link.link) {
      link_element.setAttribute('href', panel.menu_item_parent.link.link)
    }

   }
  
  
  public static applyAttributes(title_element: HTMLElement, state: InstanceState): void {
    
    title_element.classList.add(state.options.classes.panel_title_link)
  
  }

}

