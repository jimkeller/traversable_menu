import InstanceState from "../state/InstanceState"
import Renderer_PanelsContainer from "../renderer/Renderer_PanelsContainer"
import Renderer_Panel from "../renderer/Renderer_Panel"

export default class EventHandlers_Global {

  public static apply(state: InstanceState) {

    window.addEventListener('resize', 
      () => {
        
        if (state.options.panel.height_auto) {
          Renderer_PanelsContainer.panelsHeightStore(state)
        }

        if (state.options.panels_container.height_auto) {
          Renderer_PanelsContainer.resize(state)
        }

        if (state.options.panel.height_auto) {
          Renderer_Panel.activeHeightApply(state)
          Renderer_Panel.resetInactiveParentHeights(state)
        }
      }
    )

  }
}