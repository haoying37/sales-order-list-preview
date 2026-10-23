(() => {
  // 原型外壳：iPhone X屏幕375×812，含44px状态栏和34px底部安全区。
  const frame=document.getElementById('preview'),canvas=document.getElementById('canvas');
  const requested=new URLSearchParams(location.search).get('pickup');
  const preview={view:'flat',state:'ready',pickup:requested==='b'?'b':'a'};
  function sync(){
    document.querySelectorAll('[data-preview-pickup]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.previewPickup===preview.pickup)));
    document.getElementById('standalone-link').href=`pages/sales-order-list-${preview.pickup}.html?rev=p60-20261023`;
  document.querySelectorAll('[data-preview-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.previewView===preview.view)));
    document.querySelectorAll('[data-preview-state]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.previewState===preview.state)));
  }
  function load(){frame.src=`pages/sales-order-list-${preview.pickup}.html?rev=p60-20261023&view=${preview.view}&state=${preview.state}`;}
  function fit(){
    const style=getComputedStyle(canvas),width=canvas.clientWidth-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight),height=canvas.clientHeight-parseFloat(style.paddingTop)-parseFloat(style.paddingBottom);
    document.documentElement.style.setProperty('--preview-scale',String(Math.max(.1,Math.min(1,width/403,height/840))));
  }
  document.querySelectorAll('[data-preview-pickup]').forEach(button=>button.addEventListener('click',()=>{preview.pickup=button.dataset.previewPickup;frame.contentWindow.postMessage({type:'sales-preview-pickup',variant:preview.pickup},'*');sync();}));
  document.querySelectorAll('[data-preview-view]').forEach(button=>button.addEventListener('click',()=>{
    preview.view=button.dataset.previewView;
    frame.contentWindow.postMessage({type:'sales-preview-view',view:preview.view},'*');sync();
  }));
  document.querySelectorAll('[data-preview-state]').forEach(button=>button.addEventListener('click',()=>{preview.state=button.dataset.previewState;load();sync();}));
  document.getElementById('reset').addEventListener('click',()=>{load();sync();});
  document.getElementById('menu-toggle').addEventListener('click',e=>{const open=document.body.classList.toggle('scenes-open');e.currentTarget.setAttribute('aria-expanded',String(open));});
  // 集合预览页负责版本切换；嵌入时隐藏本地静态版本标识，避免重复。
  if(parent!==window)document.getElementById('local-version').hidden=true;
  if(preview.pickup==='b')load();
  new ResizeObserver(fit).observe(canvas);window.addEventListener('resize',fit);sync();fit();
})();
