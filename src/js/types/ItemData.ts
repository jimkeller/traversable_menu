interface TriggerData {
  'title' : string
}

export interface MenuItemData {
  'text': string,
  'link' : string,
  'items'? : Array<MenuItemData>,
  'trigger'? : TriggerData  
}

export interface PanelContainerData {
  items : Array<MenuItemData>
}

