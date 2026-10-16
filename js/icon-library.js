(function(){
  window.TS = window.TS || {};
  const paths = {
    grid:'<rect x="3.5" y="3.5" width="7" height="7" rx="1.4"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.4"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.4"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.4"/>',
    keyboard:'<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M6 9h.01M9 9h.01M12 9h.01M15 9h.01M18 9h.01M6 12h.01M9 12h.01M12 12h.01M15 12h.01M18 12h.01M9 15h6"/>',
    swords:'<path d="m14.5 5.5 4-2 2 2-2 4M4 20l7.3-7.3M5.5 9.5l9 9M4 4l6 1 9 9-2 2-9-9zM3 21l5-5"/>',
    target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    trophy:'<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v2a4 4 0 0 0 4 4M17 6h3v2a4 4 0 0 1-4 4"/>',
    medal:'<circle cx="12" cy="8" r="5"/><path d="m8.2 12-2.1 9 5.9-3 5.9 3-2.1-9M10 8l1.3 1.3L14.5 6"/>',
    flame:'<path d="M12 22a7 7 0 0 0 7-7c0-4-3-6-3-10-2 1-3 3-3 5-2-2-3-4-3-6-4 3-6 7-6 11a8 8 0 0 0 8 7z"/><path d="M12 22a4 4 0 0 0 4-4c0-2-1-3-2-4-1 2-2 2-2 3-1-1-2-2-2-3-2 2-2 4-2 5a4 4 0 0 0 4 3z"/>',
    chart:'<path d="M3 3v18h18"/><path d="m7 14 4-4 3 3 6-7"/><path d="M16 6h4v4"/>',
    settings:'<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.2.9-1.2 2.1-1.5-.6a8 8 0 0 1-1.6.9l-.3 1.6h-2.4l-.3-1.6a8 8 0 0 1-1.6-.9l-1.5.6-1.2-2.1 1.2-.9a7 7 0 0 1 0-1.9l-1.2-.9 1.2-2.1 1.5.6a8 8 0 0 1 1.6-.9l.3-1.6h2.4l.3 1.6a8 8 0 0 1 1.6.9l1.5-.6 1.2 2.1-1.2.9a7 7 0 0 1 0 1.9z" transform="translate(-1 -1)"/>',
    'book-open':'<path d="M12 7v14M3 5.5A2.5 2.5 0 0 1 5.5 3H12v18H5.5A2.5 2.5 0 0 0 3 23zM21 5.5A2.5 2.5 0 0 0 18.5 3H12v18h6.5A2.5 2.5 0 0 1 21 23z"/>',
    code:'<path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 4l-4 16"/>',
    'file-text':'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>',
    zap:'<path d="m13 2-3 8H5l6 12 3-8h5z"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    gauge:'<path d="M4.9 19a9 9 0 1 1 14.2 0"/><path d="m12 13 4-4M7 19h10"/><circle cx="12" cy="13" r="1"/>',
    'check-circle':'<circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16.5 9"/>',
    'x-circle':'<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6m0-6-6 6"/>',
    refresh:'<path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.5 9A7 7 0 0 1 18 6l2 6M4 12l2 6a7 7 0 0 0 12.5-3"/>',
    'rotate-ccw':'<path d="M3 12a9 9 0 1 0 2.6-6.4L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
    'volume-2':'<path d="M11 5 6 9H3v6h3l5 4zM15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>',
    'volume-x':'<path d="M11 5 6 9H3v6h3l5 4zM16 9l5 6m0-6-5 6"/>', music:'<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    focus:'<path d="M4 9V5a1 1 0 0 1 1-1h4M16 4h3a1 1 0 0 1 1 1v4M20 15v4a1 1 0 0 1-1 1h-4M9 20H5a1 1 0 0 1-1-1v-4"/><circle cx="12" cy="12" r="3"/>',
    shield:'<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z"/><path d="m9 12 2 2 4-4"/>',
    'chevron-right':'<path d="m9 18 6-6-6-6"/>',
    'arrow-up-right':'<path d="M7 17 17 7M7 7h10v10"/>',
    'circle-help':'<circle cx="12" cy="12" r="9"/><path d="M9.6 9a2.5 2.5 0 0 1 4.8 1c0 1.8-2.4 2-2.4 4M12 17h.01"/>',
    play:'<path d="m8 5 12 7-12 7z"/>', pause:'<path d="M8 5h3v14H8zM15 5h3v14h-3z"/>',
    plus:'<path d="M12 5v14M5 12h14"/>', sparkles:'<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z"/>',
    bars:'<path d="M4 19V5M10 19V9M16 19V3M22 19v-7"/>', menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
    home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z"/>', copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
    download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>', upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
    trash:'<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5"/>', star:'<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>', user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    moon:'<path d="M20.8 14.2A8.5 8.5 0 0 1 9.8 3.2 8.5 8.5 0 1 0 20.8 14.2z"/>', sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>',
    'arrow-left':'<path d="M19 12H5M12 19l-7-7 7-7"/>', 'more-horizontal':'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>', crown:'<path d="m2 8 5 4 5-8 5 8 5-4-2 12H4z"/><path d="M4 20h16"/>', pencil:'<path d="m15 5 4 4M4 20l4-.8L19.2 8a2.1 2.1 0 0 0-3-3L5 16.2z"/>', activity:'<path d="M3 12h4l3-8 4 16 3-8h4"/>', lock:'<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>', timer:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6M19 5l1.5 1.5"/>', 'arrow-right':'<path d="M5 12h14M12 5l7 7-7 7"/>', 'check':'<path d="m5 12 4 4L19 6"/>', 'alert-triangle':'<path d="M10.3 4.3 2.8 17.4A2 2 0 0 0 4.5 20h15a2 2 0 0 0 1.7-2.6L13.7 4.3a2 2 0 0 0-3.4 0z"/><path d="M12 9v4m0 3h.01"/>', 'x':'<path d="m18 6-12 12M6 6l12 12"/>', sliders:'<path d="M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3"/><path d="M2 14h4m4-6h4m4 8h4"/>', brain:'<path d="M12 18V5a3 3 0 0 0-5.8-1.1A4 4 0 0 0 4 11a4 4 0 0 0 2 7.5A3 3 0 0 0 12 18zM12 18V5a3 3 0 0 1 5.8-1.1A4 4 0 0 1 20 11a4 4 0 0 1-2 7.5A3 3 0 0 1 12 18z"/><path d="M8 8h.01M16 8h.01M7 14h.01M17 14h.01"/>', database:'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>', cpu:'<rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M9 1v4m6-4v4M9 19v4m6-4v4M1 9h4m-4 6h4m14-6h4m-4 6h4"/>'
  };
  const defaults = {stroke:'currentColor',fill:'none',strokeLinecap:'round',strokeLinejoin:'round',strokeWidth:'1.8'};
  function renderBattleMark(size,extraClass){
    const n=size||22;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="'+n+'" height="'+n+'" fill="none" aria-hidden="true" class="'+(extraClass||'typestrike-battle-icon')+'">'+
      '<rect width="100" height="100" rx="22" fill="#EFF6FF"/>'+
      '<path d="M12 27H32L42 35L32 43H12L21 35Z" fill="#315EFB"/>'+
      '<path d="M88 27H68L58 35L68 43H88L79 35Z" fill="#315EFB"/>'+
      '<path d="M50 10L53.5 19L62 22.5L53.5 26L50 35L46.5 26L38 22.5L46.5 19Z" fill="#315EFB"/>'+
      '<rect x="15" y="48" width="70" height="36" rx="9" fill="#FFFFFF" stroke="#315EFB" stroke-width="2.5"/>'+
      '<g fill="#B9CCFF"><rect x="23" y="55" width="7" height="6" rx="1.5"/><rect x="33" y="55" width="7" height="6" rx="1.5"/><rect x="43" y="55" width="7" height="6" rx="1.5"/><rect x="53" y="55" width="7" height="6" rx="1.5"/><rect x="63" y="55" width="7" height="6" rx="1.5"/><rect x="73" y="55" width="5" height="6" rx="1.5"/><rect x="23" y="65" width="7" height="6" rx="1.5"/><rect x="33" y="65" width="7" height="6" rx="1.5"/><rect x="43" y="65" width="7" height="6" rx="1.5"/><rect x="53" y="65" width="7" height="6" rx="1.5"/><rect x="63" y="65" width="7" height="6" rx="1.5"/><rect x="73" y="65" width="5" height="6" rx="1.5"/></g>'+
      '<rect x="43" y="55" width="7" height="6" rx="1.5" fill="#315EFB"/>'+
      '<rect x="34" y="75" width="32" height="3.5" rx="1.75" fill="#315EFB"/>'+
      '</svg>';
  }
  function render(name,size,extraClass){
    if(name==='swords'||name==='battle-mark') return renderBattleMark(size,extraClass);
    const body=paths[name]||paths['circle-help'];
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="'+(size||18)+'" height="'+(size||18)+'" fill="'+defaults.fill+'" stroke="'+defaults.stroke+'" stroke-width="'+defaults.strokeWidth+'" stroke-linecap="'+defaults.strokeLinecap+'" stroke-linejoin="'+defaults.strokeLinejoin+'" aria-hidden="true" class="'+(extraClass||'')+'">'+body+'</svg>';
  }
  function replace(root){ (root||document).querySelectorAll('[data-icon]').forEach(function(node){const name=node.getAttribute('data-icon');node.innerHTML=render(name);}); }
  window.TS.Icons={render:render,replace:replace,names:Object.keys(paths)};
})();