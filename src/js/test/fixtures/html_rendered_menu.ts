export const menu_html = `
<div class="traversable-menu">
   <div class="menu__panel">
      <ul>
         <li class="menu__item">
            <a class="menu__item__link" href="http://www.example.com/about">About</a><a class="menu__panel__trigger--child">Explore &gt;</a>
            <div class="menu__panel">
               <a href="#" class="menu__panel__trigger--top"></a>
               <a href="#" class="menu__panel__trigger--parent">Up a level (this gets replaced in JS)</a>
               <a href="#" class="menu__panel__title"></a>
               <ul>
                  <li class="menu__item"><a class="menu__item__link" href="http://www.example.com/our-team">Our team</a></li>
                  <li class="menu__item">
                     <a class="menu__item__link" href="http://localhost:45473/#our-mission">Our mission</a><a class="menu__panel__trigger--child">Explore &gt;</a>
                     <div class="menu__panel">
                        <a href="#" class="menu__panel__trigger--top"></a>
                        <a href="#" class="menu__panel__trigger--parent">Up a level (this gets replaced in JS)</a>
                        <a href="#" class="menu__panel__title"></a>
                        <ul>
                           <li class="menu__item"><a class="menu__item__link" href="http://www.example.com/tertiary-1">Tertiary 1</a></li>
                        </ul>
                     </div>
                  </li>
               </ul>
            </div>
         </li>
         <li class="menu__item"><a class="menu__item__link" href="other">Other</a></li>
         <li class="menu__item">
            <a class="menu__item__link" href="http://www.example.com/products">Products</a><a href="#" class="menu__panel__trigger--child">Explore &gt;</a>
            <div class="menu__panel">
               <a href="#" class="menu__panel__trigger--top"></a>
               <a href="#" class="menu__panel__trigger--parent">Up a level (this gets replaced in JS)</a>
               <a href="#" class="menu__panel__title"></a>
               <ul>
                  <li class="menu__item"><a class="menu__item__link" href="http://www.example.com/shoes">Shoes</a></li>
                  <li class="menu__item">
                     <a class="menu__item__link" href="http://www.example.com/shirts">Shirts</a><a href="#" class="menu__panel__trigger--child">Explore &gt;</a>
                     <div class="menu__panel">
                        <a href="#" class="menu__panel__trigger--top"></a>
                        <a href="#" class="menu__panel__trigger--parent">Up a level (this gets replaced in JS)</a>
                        <a href="#" class="menu__panel__title"></a>
                        <ul>
                           <li class="menu__item"><a class="menu__item__link" href="http://www.example.com/big-shirts">Big shirts</a></li>
                           <li class="menu__item"><a class="menu__item__link" href="http://www.example.com/little-shirts">Little shirts</a></li>
                        </ul>
                     </div>
                  </li>
               </ul>
            </div>
         </li>
      </ul>
   </div>
</div>
</div>
`