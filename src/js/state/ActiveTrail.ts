import InstanceState from "./InstanceState"

export default class ActiveTrail {

  state : InstanceState
  
  constructor( state : InstanceState ) {
    this.state = state
  }

  /** 
   * Return all the selectors that we might want to use to identify the 'active' element,
   * including checking for links that look at the current URL
   * @param {InstanceState} state The state object for this instance of the library   
  */
  public static activeItemSelectors(state: InstanceState) : string[] {

    let selectors: string[] = []

    if (state.options.active.selectors == null) {

      if (state.options.active.find_by_class) {
        selectors.push( state.options.selectors.menu_item_active)
        selectors.push( state.options.selectors.menu_item_link_active)
      }

      if (state.options.active.find_by_url) {
        selectors = selectors.concat(selectors, ActiveTrail.activeURLSelectors(state))
      }

      if (state.options.active.selectors_additional) {

        const link_selectors = state.options.active.selectors_additional

        for ( let i = 0; i < link_selectors.length; i++ ) {
          selectors.push( link_selectors[i] )
        }
      }
    }
    else {
      selectors = state.options.active.selectors
    }

    return selectors

  }

  /**
  * Determine the active URL, including any overridden active URL set in the options
  * @param {InstanceState} state The state object for this instance of the library   
  */
  public static activeURLsGet(state: InstanceState) : string[] {
    
    let active_urls: string[] = []

    //
    // Check for explicitly set active urls
    //
    if ( state.options.active.urls !== null ) {

      const active_urls_explicit = state.options.active.urls

      if ( typeof(active_urls_explicit) == 'function' && typeof(active_urls_explicit.call) == 'function' ) {
        active_urls = active_urls.concat( active_urls_explicit.call(this))
      }
      else {
        active_urls = active_urls.concat(active_urls_explicit as Array<string>)
      }
    }
    else {
      active_urls = ActiveTrail.activeURLsDefault(state)
    }

    return active_urls
  }

  public static activeURLsDefault(state: InstanceState) : string[] {

    let active_urls : string[] = []
    let href_split = window.location.href.split('#')
    let pathname_with_query_string = window.location.href

    pathname_with_query_string = pathname_with_query_string.replace(/^[A-Za-z0-9]+:\/\//, '')
    pathname_with_query_string = pathname_with_query_string.substr( pathname_with_query_string.indexOf('/') )

    //
    // Make sure these are in order of most to least favorable/specific;
    // Matching is done on a first-match basis
    //
    active_urls = [
      pathname_with_query_string,
      window.location.pathname,
      window.location.href
    ]

    //
    // Additional possible permutations of URL
    //
    if ( href_split.length > 1 ) {
      active_urls.push( href_split[0] ) //URL without fragment

      href_split = href_split[0].split('?')
      if ( href_split.length > 1 ) {
        active_urls.push( href_split[0] ) //URL without fragment or query string
      }
    }

    href_split = window.location.href.split('?')
    if ( href_split.length > 1 ) {
      active_urls.push( href_split[0] ) //URL without query string
    }

    return active_urls

  }

  public static activeURLSelectors(state: InstanceState) : string[] {

    const valid_urls = ActiveTrail.activeURLsGet(state)
    const selectors = []
    
    for ( let i = 0; i < valid_urls.length; i++ ) {
      selectors.push( '[href="' + valid_urls[i] + '"]' )
    }

    return selectors
    
  }

  
}