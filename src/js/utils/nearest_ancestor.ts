const nearestAncestor = function(element: Element | Node, selector : string) : HTMLElement | null {

  if ( typeof(element.parentElement) != 'undefined' ) {

    let parent = element.parentElement

    if ( parent ) {
      if ( element instanceof Element ) {
          //
          // closest will return the current element if it maches,
          // which is why we can call it on the immediate parent.
          //
          return parent.closest(selector)
      }
      else {
        while( parent ) {
          if ( parent.matches(selector) ) {
              return parent
          }

          parent = parent.parentElement

        }
      }
    }
  }

  return null
}

export default nearestAncestor