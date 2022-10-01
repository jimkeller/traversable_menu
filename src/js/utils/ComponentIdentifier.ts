import InstanceState from "../state/InstanceState"
import { DATA_ATTR_ELEMENT_ID } from "../constants/constants"
export default class ComponentIdentifier {

  state: InstanceState

  constructor(state : InstanceState) {
    this.state = state
  }
  
  public static elementIDGet(element: Element): string | null {

    if ( element && typeof(element.getAttribute) != 'undefined') {
      return element.getAttribute(DATA_ATTR_ELEMENT_ID)
    }

    return null
  }

  public static elementApply(element: Element, id?: string) {

    id ||= ComponentIdentifier.newID()

    element.setAttribute(DATA_ATTR_ELEMENT_ID, id )

  }

  public static newID(): string {
    return 'i_' + ComponentIdentifier.generateUniqueSerial()
  }

  public static generateUniqueSerial(): string {  
    return 'xxxx-xxxx-xxx'.replace(/[x]/g, () => {  
      const r = Math.floor(Math.random() * 12)
      return r.toString(12)
    })
  }

}