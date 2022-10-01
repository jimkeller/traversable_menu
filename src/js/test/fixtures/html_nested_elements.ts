export const nested_html = 
`
<div id="test-immediate-children">
  <div id="immediate-child-1" class="immediate-child">
    Immediate Child 1
    <div class="descendant-child">
      Descendant 1-1
      <div id="grandchild-1-1" class="descendant-grandchild">
        Granchild 1-1
      </div>
    </div>
    <div class="descendant-child">
      Descendant 1-2
    </div>
  </div>
  <div class="immediate-child">
    Immediate Child 2
    <div class="descendant-child">
      Descendant 2-1
    </div>
    <div class="descendant-child">
      Descendant 2-2
    </div>
  </div>
</div>
`