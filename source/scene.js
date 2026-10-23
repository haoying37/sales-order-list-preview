(() => {
  'use strict';
  // 数据：wsxc_order/preprod@a3f8a92 正式 sales_order_list 路由；订单/按钮/配置/标签为本地模拟。
  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const tabs = [['all','全部'],['pending_receipts','待收款'],['pending_delivery','待发货'],['delivered','已发货'],['hold','挂起'],['refund','退换']];
  const customers = ['林女士','陈先生','小禾服饰','许女士','阿棠女装','周女士'];
  const sources = ['自有商品','杭州上家','广州上家'];
  // 客户头像来自用户指定的Figma卡片头像节点；本地导出素材，不对应真实客户账号。
  const customerAvatars = ['lin','chen','xiaohe','xu','atang','zhou'].map(name=>`customers/${name}-figma.png`);
  const goods = [
    {title:'半拉链立领休闲卫衣',goodsNum:'HZ1026',code:'WY1026',price:268,discountPrice:238,icon:'web-product-2.jpg'},
    {title:'秋季日常休闲款',goodsNum:'QJ2028',code:'QJ2028',price:199,discountPrice:199,icon:'web-product-1.png'},
    {title:'秋冬精选上新款',goodsNum:'QJ2036',code:'QJ2036',price:328,discountPrice:298,icon:'web-product-3.jpg'},
    {title:'圆领落肩长袖T恤',goodsNum:'TS1038',code:'TS1038',price:129,discountPrice:109,icon:'web-product-2.jpg'},
    {title:'宽松针织开衫',goodsNum:'KZ2040',code:'KZ2040',price:259,discountPrice:239,icon:'web-product-1.png'},
    {title:'休闲直筒长裤',goodsNum:'CK2042',code:'CK2042',price:229,discountPrice:199,icon:'web-product-3.jpg'},
    {title:'连帽拉链外套',goodsNum:'WT2045',code:'WT2045',price:359,discountPrice:329,icon:'web-product-2.jpg'},
    {title:'轻薄棉质衬衫',goodsNum:'CS2048',code:'CS2048',price:189,discountPrice:169,icon:'web-product-1.png'},
    {title:'高腰百褶半裙',goodsNum:'BQ2050',code:'BQ2050',price:219,discountPrice:199,icon:'web-product-3.jpg'},
    {title:'复古翻领夹克',goodsNum:'JK2053',code:'JK2053',price:399,discountPrice:369,icon:'web-product-2.jpg'},
    {title:'基础款针织背心',goodsNum:'BX2056',code:'BX2056',price:159,discountPrice:139,icon:'web-product-1.png'},
    {title:'松紧腰阔腿裤',goodsNum:'CK2058',code:'CK2058',price:249,discountPrice:219,icon:'web-product-3.jpg'},
    {title:'中长款风衣',goodsNum:'FY2060',code:'FY2060',price:499,discountPrice:459,icon:'web-product-2.jpg'}
  ];
  const fixtureButtons = {
    pending_receipts:[['share','分享'],['close','取消订单'],['invite','邀Ta付款'],['pay','记收款',true]],
    pending_delivery:[['share','分享'],['againOrder','再来一单'],['returnExchangeList','退换'],['holdList','挂起'],['delivery','发货',true]],
    delivered:[['share','分享'],['againOrder','再来一单'],['returnExchangeList','退换'],['viewLogistics','查看物流']],
    hold:[['share','分享'],['refundList','退款'],['unhold','恢复配货',true]],
    refund:[['share','分享'],['checkSalesOrder','查看销售单']]
  };
  const comparisonPage=Boolean(document.body.dataset.pickupVariant);
  // 原型能力：A/B共用用户截图红框中的6个提货点名称，保留缺失名称和快递反例。
  const pickupNames={0:"1～2群佛山禅城印象城店",1:"52群佛山南海鹏瑞利季华广场店",2:"3群佛山大沥伟业兴隆广场店",3:"快递订单不展示此名称",4:"3群佛山南海千灯湖店",5:"6群谜后广州白云区白云汇广场店",10:"4群谜后 （广州白云百世广场店）",11:"1～2群佛山禅城印象城店",14:"3群佛山南海千灯湖店",15:"6群谜后广州白云区白云汇广场店",17:"4群谜后 （广州白云百世广场店）"};
  function createFixtures() {
    const types = ['pending_receipts','pending_delivery','delivered','pending_delivery','hold','refund','pending_receipts','delivered','pending_delivery','hold','refund','pending_receipts','delivered','pending_delivery','pending_receipts','hold','refund','delivered'];
    return types.map((tab,i) => {
      if(comparisonPage&&i===4)tab='delivered'; // 用户指定的阿棠女装样例由挂起改为已提货主单。
      const items = [{...goods[i%3],count:2+i%3,goods_id:`g${i%3}`,shop_id:'demo'}];
      if(i%4===1) items.push({...goods[(i+1)%3],count:1,goods_id:`g${(i+1)%3}`,shop_id:'demo'});
      // 长单据样例：第二张陈先生自提订单5款22件；复用本地商品图，金额/数量仍由现有汇总函数计算。
      if(i===1){
        const counts=[3,1,6,8,4];
        items.splice(0,items.length,...counts.map((count,j)=>({...goods[j+1],count,goods_id:`g${j+1}`,shop_id:'demo'})));
      }
      const deliveryMethod = i<2||i%5===0||(comparisonPage&&[2,4,7,8,11,14,17].includes(i)) ? '自提' : '快递';
      const postage = deliveryMethod==='自提'||i%3===0 ? 0 : 10;
      return {id:`XS20261022${String(36-i).padStart(4,'0')}`,tab,statusVal:{pending_receipts:0,pending_delivery:1,delivered:3,hold:6,refund:4}[tab],statusTxt:comparisonPage&&tab==='delivered'&&deliveryMethod==='自提'?'已提货':tab==='pending_delivery'&&deliveryMethod==='自提'?'待提货':tab==='refund'?(i%2?'待买家退货':'已退款'):tabs.find(t=>t[0]===tab)[1],customer:customers[i%6],avatar:customerAvatars[i%6],source:sources[i%3],phone:`1380000${String(1000+i)}`,date:`2026-10-${String(22-Math.floor(i/2)).padStart(2,'0')}`,time:`${String(16-i%6).padStart(2,'0')}:${String(48-i%40).padStart(2,'0')}`,creator:['小林','店主','小陈'][i%3],deliveryMethod,note:i%3===0?(deliveryMethod==='自提'?'到店前请联系，商品分装打包':'到货后请联系，分装打包'):'',postage,items,pickPointInfoVO:{name:pickupNames[i]||''},updated:100-i,created:100-i*2,paid:i%2?100-i:50+i,quickTypes:comparisonPage&&tab==='delivered'&&deliveryMethod==='自提'?[]:i%3===0?[1,12]:i%3===1?[5,11,18]:[12],orderType:'0',payMethod:i%2?'微信':'现金',promoter:i%2?'小徐':'',printed:i===3,refundKind:i%2?'exchange':'refund',tags:i===3?['部分发货']:[],buttons:comparisonPage&&tab==='pending_delivery'&&deliveryMethod==='自提'?[['share','分享'],['againOrder','再来一单'],['returnExchangeList','退换'],['holdList','挂起'],['refundList','退款'],['allocate','配货'],['delivery','核销',true]]:comparisonPage&&tab==='delivered'&&deliveryMethod==='自提'?[['share','分享'],['againOrder','再来一单'],['holdList','挂起'],['returnExchangeList','退换']]:comparisonPage&&tab==='refund'&&i%2===0?[['share','分享']]:fixtureButtons[tab].map(b=>comparisonPage&&tab==='pending_receipts'&&b[0]==='close'?['againOrder','再来一单']:[...b])};
    }).filter(o=>!comparisonPage||(o.statusTxt!=='待买家退货'&&!['XS202610220021','XS202610220020'].includes(o.id))); // 本轮移除截图中的许女士挂起单和阿棠已退款单。
  }
  const params = new URLSearchParams(location.search);
  const initialTab = location.hash.match(/sales_order\/([^/?]+)/)?.[1] || params.get('tab') || 'all';
  const state = {
    pickupVariant:document.body.dataset.pickupVariant||'',orders:createFixtures(),tab:tabs.some(t=>t[0]===initialTab)?initialTab:'all',query:'',draftQuery:'',
    filter:{start:'',end:'',customer:'',source:'',orderType:'',payMethod:'',remark:'',staff:'',promoter:''},draftFilter:null,visibleIds:[],limit:6,loading:false,
    pageState:params.get('state')||'ready',view:params.get('view')==='compact'?'compact':'flat',sorts:{},quick:'',searchType:'ALL',searchTypesOpen:false,menu:null,onlyMatches:false,filterOpen:false,dialog:null,sheet:null,routes:[],views:{},request:0,toastTimer:0,focusBefore:null
  };
  const emptyFilter = () => ({start:'',end:'',customer:'',source:'',orderType:'',payMethod:'',remark:'',staff:'',promoter:''});
  const searchTypes=[['ALL','全部'],['SUPPLIER_SOURCE','供应商(来源)'],['CUSTOMER_NAME','客户名'],['RECEIVE_INFO','收件人信息'],['COMMODITY_NAME','商品名'],['COMMODITY_NUM','货号'],['REMARK','备注']];
  const quickConfig={all:[[1,'超7天未发']],pending_delivery:[[1,'超7天未发'],[5,'催发货'],[11,'已配货'],[12,'未配货']],delivered:[[18,'待确认收货']],refund:[['refund','退款'],['exchange','换货']]};
  try{state.sorts=JSON.parse(localStorage.getItem('wego-demo-sales-preprod-sorts')||'{}');}catch{state.sorts={};}
  // 计算：样例合计只计算一次；真实源码的 amount/count/postageSum 由服务端返回。
  const totalCount = o => o.items.reduce((n,g)=>n+g.count,0);
  const totalAmount = o => o.items.reduce((n,g)=>n+Math.round(g.discountPrice*100)*g.count,0)+o.postage*100;
  const money = cents => (cents/100).toFixed(2).replace(/\.00$/,'');
  const orderById = id => state.orders.find(o=>o.id===id);
  const viewKey = () => JSON.stringify([state.tab,state.query,state.filter,state.quick,state.sorts[state.tab],state.view,state.onlyMatches]);
  function searchMatch(o,query=state.query){
    if(!query)return true;
    const field={SUPPLIER_SOURCE:o.source,CUSTOMER_NAME:o.customer,RECEIVE_INFO:o.customer+' '+o.phone,COMMODITY_NAME:o.items.map(g=>g.title).join(' '),COMMODITY_NUM:o.items.map(g=>g.goodsNum).join(' '),REMARK:o.note};
    const text=state.searchType==='ALL'?[o.id,o.customer,o.phone,o.note,o.source,...o.items.flatMap(g=>[g.title,g.goodsNum,g.code])].join(' '):(field[state.searchType]||'');
    return text.toLocaleLowerCase().includes(query.toLocaleLowerCase());
  }
  function matches(o,{tab=state.tab,query=state.query,filter=state.filter,quick=state.quick}={}){
    return (tab==='all'||o.tab===tab) && searchMatch(o,query) && (!filter.start||o.date>=filter.start) && (!filter.end||o.date<=filter.end) && (!filter.customer||o.customer===filter.customer) && (!filter.source||o.source===filter.source) && (!filter.orderType||o.orderType===filter.orderType) && (!filter.payMethod||o.payMethod===filter.payMethod) && (!filter.staff||o.creator===filter.staff) && (!filter.promoter||o.promoter===filter.promoter) && (!filter.remark||(filter.remark==='有备注'?!!o.note:!o.note)) && (!quick||(state.tab==='refund'?o.refundKind===quick:o.quickTypes.includes(Number(quick))));
  }
  function sortedOrders(list){
    const sort=state.sorts[state.tab]||(state.tab==='hold'?'0':'2');
    return [...list].sort((a,b)=>sort==='0'?b.created-a.created:sort==='1'?a.created-b.created:sort==='3'?b.paid-a.paid:sort==='4'?a.paid-b.paid:b.updated-a.updated);
  }
  function saveView(){state.views[viewKey()]={top:$('list-scroll').scrollTop,left:$('list-scroll').scrollLeft,limit:state.limit};}
  // 渲染：列表 DOM 重绘保留滚动，弹层与详情覆盖在现有列表上。
  const icon=(name)=>`<i class="wego-iconfont-s ${name}" aria-hidden="true"></i>`;
  function goodsHTML(g,index=0,o=null){
    const sku1=Math.ceil(g.count/2),sku2=g.count-sku1;
    return `<div class="goods-row"><button class="goods-image-button" data-action="product" data-index="${index}" aria-label="查看${esc(g.title)}"><img class="goods-image" src="../assets/image/${esc(g.icon)}" alt="${esc(g.title)}"></button><div class="goods-copy"><div class="goods-main"><div class="goods-title-number"><div class="goods-title">${esc(g.title)}</div><div class="goods-number">货号：${esc(g.goodsNum)}</div></div><div class="goods-price"><div>¥${g.discountPrice}</div>${g.price!==g.discountPrice?`<div class="line-through">¥${g.price}</div>`:''}<div class="quantity">x ${g.count}</div></div></div><div class="sku-row"><span>白色 / M</span>${o?.tab==='pending_receipts'?`<button data-action="stock" class="stock-link">库存${sku1-1}，去补货 ›</button>`:''}<span>x ${sku1}</span></div>${sku2?`<div class="sku-row"><span>白色 / L</span><span>x ${sku2}</span></div>`:''}</div></div>`;
  }
  function buttonHTML(b){const [action,label,highlight]=b;return `<button class="order-button${highlight?' highlight':''}" data-action="${action}">${esc(label)}</button>`;}
  const isPendingPickup=o=>comparisonPage&&o.tab==='pending_delivery'&&o.deliveryMethod==='自提';
  function exposedButtons(o){
    // 本轮确认平铺固定外露退款、配货、核销；原其余操作保留在更多。
    if(isPendingPickup(o))return {hidden:o.buttons.filter(b=>['againOrder','returnExchangeList','holdList'].includes(b[0])),shown:o.buttons.filter(b=>['refundList','allocate','delivery'].includes(b[0]))};
    const list=o.buttons.filter(b=>b[0]!=='share'),widths={close:88,pay:74,invite:89,againOrder:88,holdList:60,returnExchangeList:60,delivery:60,viewLogistics:88,unhold:88,refundList:60,checkSalesOrder:116};
    const available=$('list-page').clientWidth-68;let used=0,count=0;
    for(const b of [...list].reverse()){const w=(widths[b[0]]||88)+8;if(used+w+(count+1<list.length?68:0)>available)break;used+=w;count++;}
    return {hidden:list.slice(0,Math.max(0,list.length-count)),shown:list.slice(Math.max(0,list.length-count))};
  }
  // 展示规则只格式化文案，原date仍用于筛选/排序。2026省略年份，跨年保留。
  const displayOrderTime=o=>`${state.pickupVariant&&o.date.startsWith('2026-')?o.date.slice(5):o.date} ${o.time}`;
  const orderSourceLabel=()=>state.pickupVariant?'【商家开单】':'【开单】';
  const isCompletedPickup=o=>comparisonPage&&o.tab==='delivered'&&o.deliveryMethod==='自提';
  function orderAmountHTML(o){
    const name=state.view!=='compact'&&state.pickupVariant&&o.deliveryMethod==='自提'?String(o.pickPointInfoVO?.name||'').trim():'';
    const pay=o.tab!=='pending_receipts'&&o.tab!=='refund'?` <small>${esc(o.payMethod)}</small>`:'';
    const staff=`<span class="staff-badge"><img src="../assets/image/avatar.png" alt="">${esc(o.creator)}</span>`;
    const delivery=`<span class="amount-delivery">${name&&state.pickupVariant==='a'?`<span class="pickup-method">自提</span> <span class="pickup-name" data-name="${esc(name)}">(${esc(name)})</span>`:esc(o.deliveryMethod)}</span>`;
    // A/B按本轮批注交换左列两字段；原独立基线入口保持原顺序。
    return `<div class="order-amount"><div class="amount-top">${state.pickupVariant?staff:delivery}<span class="amount-time">${esc(displayOrderTime(o))}　${orderSourceLabel()}</span></div><div class="amount-bottom${name&&state.pickupVariant==='a'?' amount-bottom--pickup':''}">${state.pickupVariant?delivery:staff}<span class="amount-summary">${o.tab==='hold'?'挂起 ':o.tab==='refund'?'退款 ':''}共${totalCount(o)}件${isCompletedPickup(o)?pay:''} <strong class="${o.tab==='refund'?'refund-amount':''}">¥${money(totalAmount(o))}</strong>${o.postage?` <small>(含运费${o.postage})</small>`:''}${isCompletedPickup(o)?'':pay}</span></div>${name&&state.pickupVariant==='b'?`<div class="pickup-line"><span class="pickup-label">提货点：</span><span class="pickup-name" data-name="${esc(name)}">${esc(name)}</span></div>`:''}</div>`;
  }
  function cardHTML(o,detail=false){
    const compact=state.view==='compact'&&!detail;
    const shownItems=!detail&&state.onlyMatches&&state.tab==='pending_delivery'&&state.query&&['ALL','COMMODITY_NAME','COMMODITY_NUM'].includes(state.searchType)?o.items.filter(g=>[g.title,g.goodsNum,g.code].join(' ').toLocaleLowerCase().includes(state.query.toLocaleLowerCase())):o.items;
    const displayItems=shownItems.length?shownItems:o.items;
    const title=`<button data-action="customer" class="customer-avatar" aria-label="查看客户${esc(o.customer)}"><img src="../assets/image/${esc(o.avatar)}" alt="" width="32" height="32"></button><div class="customer-copy"><div class="customer-name-row"><button class="customer-name" data-action="customer">${esc(o.customer)}</button></div>${compact?`<div class="compact-meta">${esc(displayOrderTime(o))}　${state.pickupVariant?orderSourceLabel():'开单'}　${esc(o.deliveryMethod)}</div>`:''}</div><div class="order-status${comparisonPage&&['已发货','已提货'].includes(o.statusTxt)?' order-status--secondary':''}">${o.printed?'<small>已打小票</small><b class="status-divider"></b>':''}<span>${esc(o.statusTxt)}</span></div>`;
    if(compact){return `<article class="order-card compact" data-id="${o.id}" tabindex="0" data-source-component="WholesaleCardItem" aria-label="${esc(o.customer)} ${esc(o.statusTxt)} ${o.id}"><div class="order-head">${title}</div><div class="compact-goods"><div class="compact-images">${displayItems.map(g=>`<div class="compact-good"><img src="../assets/image/${g.icon}" alt="${esc(g.title)}"><div>${esc(g.goodsNum+' '+g.title)}</div><span>x${g.count}</span></div>`).join('')}</div><div class="compact-info"><div class="compact-amount${o.tab==='refund'?' refund-amount':''}">${o.tab==='refund'?'退 ':''}¥${money(totalAmount(o))}</div><div class="compact-count">${o.tab==='hold'?'挂起 ':''}共${totalCount(o)}件</div>${o.tab!=='pending_receipts'&&o.tab!=='refund'?`<small>${esc(o.payMethod)}</small>`:''}<button class="compact-more" data-action="order-menu" aria-label="订单更多操作">${icon('icon-sandian16')}</button></div></div></article>`;}
    const {hidden,shown}=exposedButtons(o);
    const note=o.note?`<div class="note-box"><div class="note-row"><span>商家备注</span><span>${esc(o.note)}</span></div></div>`:'';
    return `<article class="order-card" data-id="${o.id}" tabindex="${detail?-1:0}" data-source-component="OrderCardItem" aria-label="${esc(o.customer)} ${esc(o.statusTxt)} ${o.id}"><div class="order-head">${title}</div>${displayItems.map(g=>goodsHTML(g,o.items.indexOf(g),o)).join('')}${note}${orderAmountHTML(o)}${detail?'':`<div class="order-actions${isPendingPickup(o)?' order-actions--pickup':''}" data-prototype="接口按钮的本地样例"><button class="share-button" data-action="share" aria-label="分享订单">${icon('icon-fenxiangjiu')}</button><div class="order-buttons">${hidden.length?'<button class="order-button" data-action="hidden-menu">更多</button>':''}${shown.map(buttonHTML).join('')}</div></div>`}</article>`;
  }
  function renderTabs(){
    $('tabs').innerHTML=tabs.map(([id,title])=>`<button type="button" class="source-tab" id="tab-${id}" role="tab" aria-selected="${state.tab===id}" aria-controls="orders" tabindex="${state.tab===id?0:-1}" data-action="tab" data-tab="${id}">${title}${['all','pending_delivery','delivered','hold'].includes(id)?icon('icon-xiajiantou-mian16'):''}</button>`).join('');
    $('orders').setAttribute('aria-labelledby',`tab-${state.tab}`);
    $('search-input').placeholder='客户/商品/货号/收件人'+(['all','delivered','refund'].includes(state.tab)?'/快递单号':'')+'/备注';
    renderQuick();
  }
  function renderQuick(){
    const quickLeft=$('quick-filters').querySelector('.quick-scroll')?.scrollLeft||0;
    const items=quickConfig[state.tab]||[];
    $('quick-filters').hidden=!items.length;
    $('quick-filters').innerHTML=`<div class="quick-scroll">${items.map(([id,label])=>{const count=state.orders.filter(o=>matches(o,{quick:id})).length;return `<button class="quick-tag" data-action="quick-filter" data-value="${id}" aria-pressed="${String(state.quick)===String(id)}">${label}(${count})</button>`;}).join('')}</div>${state.tab==='pending_delivery'&&(state.query||state.filter.source)?`<button class="only-matches" data-action="only-matches" aria-pressed="${state.onlyMatches}"><span>${state.onlyMatches?'☑':'□'}</span>仅展示${state.filter.source?'来源':'商品'}</button>`:''}`;
    const quickScroll=$('quick-filters').querySelector('.quick-scroll');if(quickScroll)quickScroll.scrollLeft=quickLeft;
  }
  function renderSummary(){
    const f=state.filter, date=f.start&&f.end?`${f.start} - ${f.end}`:f.start?`> ${f.start}`:f.end?`< ${f.end}`:'';
    const labels=[date,f.customer,f.source,f.orderType==='0'?'有商品订单':f.orderType==='1'?'无商品订单':'',f.payMethod,f.remark,f.staff,f.promoter].filter(Boolean);
    $('filter-summary').hidden=!labels.length;
    $('filter-summary').innerHTML=labels.length?`<span class="filter-summary-text">${esc(labels.join('、'))}</span><button data-action="clear-filter" aria-label="清除筛选">×</button>`:'';
    $('open-filter').classList.toggle('active',!!labels.length);
  }
  function renderList() {
    const scroll=$('list-scroll'), top=scroll.scrollTop, left=scroll.scrollLeft;
    const list=state.visibleIds.slice(0,state.limit).map(orderById).filter(Boolean);
    $('orders').innerHTML=state.pageState==='ready'&&!state.loading?list.map(o=>cardHTML(o)).join(''):'';
    const busy=state.loading||state.pageState==='loading';
    let html='';
    if(busy) html='<div class="state-message"><span class="loading-dot" aria-hidden="true"></span>正在加载...</div>';
    else if(state.pageState==='error') html='<div class="state-message"><p>加载失败，请稍后重试</p><button class="weui_btn weui_btn_default" data-action="retry">刷新试试</button></div>';
    else if(!list.length) html='<div class="state-message empty-order"><img src="../assets/image/icon-search-result.png" alt=""><p>暂无相关订单</p></div>'; 
    else html=state.limit<state.visibleIds.length?'<button class="load-more" data-action="load-more">加载更多</button>':'<div class="weui_loadmore weui_loadmore_line weui_loadmore_dot"><span class="weui_loadmore_tips"></span></div>';
    $('list-status').innerHTML=html;
    $('orders').setAttribute('aria-busy',String(busy));
    const batch=state.pageState==='ready'&&!state.loading&&list.length>0&&['all','pending_delivery','delivered','hold'].includes(state.tab);
    $('batch-bar').hidden=!batch;
    let batchButtons=[];
    if(state.tab==='all')batchButtons=[['batch-export','批量导出'],['batch-print','打印小票'],['batch-prepare','备货/配货'],['batch-delivery','批量发货']];
    if(state.tab==='pending_delivery')batchButtons=[['batch-more','更多'],['batch-print','打印小票'],['batch-prepare','备货/配货'],['batch-delivery','批量发货']];
    if(state.tab==='delivered')batchButtons=[['batch-export','批量导出']];
    if(state.tab==='hold')batchButtons=[['batch-recover','批量恢复配货']];
    $('batch-bar').innerHTML=batch?`<div class="batch-actions">${batchButtons.map(([action,label],i)=>`<button class="${i===batchButtons.length-1?'highlight':''}" data-action="${action}">${label}</button>`).join('')}</div>`:'';
    scroll.scrollTop=top;scroll.scrollLeft=left;
  }
  function syncInert() {
    $('list-page').inert=Boolean(state.filterOpen||state.dialog||state.sheet||state.menu||state.routes.length);
    $('secondary').inert=Boolean(state.dialog||state.sheet||state.menu);
    $('filter-layer').inert=Boolean(state.dialog);
  }
  function syncSearch(){
    $('clear-search').hidden=!state.draftQuery;$('image-search').hidden=state.searchTypesOpen;$('open-filter').hidden=state.searchTypesOpen;
    const type=searchTypes.find(t=>t[0]===state.searchType);
    $('search-type-label').hidden=state.searchType==='ALL'||state.searchTypesOpen||!state.draftQuery;
    $('search-type-label').textContent=(type?.[1]||'')+'：';
  }
  function renderFilter(){
    const f=state.draftFilter;
    $('start-date').value=f.start;$('end-date').value=f.end;
    $('extra-filter-groups').innerHTML=[['订单类型','orderType',[['0','有商品订单'],['1','无商品订单']]],['支付方式','payMethod',[['微信','微信'],['现金','现金']]],['留言和备注','remark',[['有备注','有备注'],['无备注','无备注']]],['员工','staff',[['店主','店主'],['小林','小林'],['小陈','小陈']]],['推广员','promoter',[['小徐','小徐']]]].map(([title,key,values])=>`<div class="weui_cells_title">${title}</div><div class="filter-tags">${values.map(([v,label])=>`<button class="filter-tag" data-action="filter-option" data-key="${key}" data-value="${v}" aria-pressed="${f[key]===v}">${label}</button>`).join('')}</div>`).join('');
    for(const [id,values,key] of [['source-options',sources,'source'],['customer-options',customers,'customer']]) {
      $(id).innerHTML=values.map(v=>`<button class="filter-tag" data-action="filter-option" data-key="${key}" data-value="${esc(v)}" aria-pressed="${f[key]===v}">${esc(v)}</button>`).join('');
    }
  }
  const motionFinished = el => new Promise(resolve => {
    let done=false;const finish=()=>{if(done)return;done=true;el.removeEventListener('transitionend',finish);resolve();};
    el.addEventListener('transitionend',finish,{once:true});setTimeout(finish,340);
  });
  // 动作：请求与成功结果仅为本地模拟；无 fetch、无真实收款/关闭/发货。
  async function fetchList(restore=false) {
    const request=++state.request, previous=restore?state.views[viewKey()]:null;
    const oldTop=$('list-scroll').scrollTop;
    state.visibleIds=state.pageState==='empty'?[]:sortedOrders(state.orders.filter(o=>matches(o))).map(o=>o.id);
    state.limit=previous?.limit||6;
    state.loading=true;
    // 保留旧 DOM，避免 loading 短暂移除列表导致滚动位置归零。
    $('orders').setAttribute('aria-busy','true');
    $('list-status').innerHTML='<div class="state-message"><span class="loading-dot" aria-hidden="true"></span>正在加载...</div>';
    await new Promise(r=>setTimeout(r,180));
    if(request!==state.request)return;
    state.loading=false;renderList();renderSummary();renderQuick();
    $('list-scroll').scrollTop=previous?.top??oldTop;
    $('list-scroll').scrollLeft=previous?.left??0;
    saveView();autoLoad();
  }
  function autoLoad() {
    const sc=$('list-scroll');
    if(state.loading||state.pageState!=='ready'||state.routes.length||state.filterOpen||state.limit>=state.visibleIds.length)return;
    if(sc.scrollHeight-sc.scrollTop-sc.clientHeight<3000){state.limit+=6;renderList();saveView();}
  }
  function changeTab(tab) {
    if(tab===state.tab)return;
    saveView();state.tab=tab;state.quick='';
    // 导览副本带有base标签；历史地址必须基于实际文档URL，避免离线file地址越界。
    const url=new URL(location.href);url.hash=`sales_order/${tab}`;
    history.replaceState({depth:0},'',url.href);
    renderTabs();fetchList(true);
  }
  function doSearch(value) {
    closeSearchTypes();saveView();state.query=value.trim();state.draftQuery=state.query;
    $('search-input').value=state.query;syncSearch();$('search-input').blur();
    if(['error','loading'].includes(state.pageState))state.pageState='ready';
    fetchList();
  }
  function rememberFocus(){state.focusBefore=document.activeElement;}
  function restoreFocus(){const el=state.focusBefore;if(el?.isConnected&&!el.closest('[inert]'))el.focus({preventScroll:true});}
  function openFilter(){rememberFocus();state.draftFilter={...state.filter};state.filterOpen=true;renderFilter();$('filter-layer').hidden=false;requestAnimationFrame(()=>$('filter-layer').dataset.state='open');syncInert();$('start-date').focus({preventScroll:true});}
  async function closeFilter(){state.filterOpen=false;$('filter-layer').dataset.state='closed';await motionFinished(document.querySelector('.filter-panel'));$('filter-layer').hidden=true;syncInert();restoreFocus();}
  function openDialog(title,body,confirm=null,cancelLabel='取消'){
    rememberFocus();state.dialog={title,body,confirm};
    $('dialog-root').innerHTML=`<div class="source-mask" aria-hidden="true"></div><div class="weui_dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><div class="weui_dialog_hd"><strong class="weui_dialog_title" id="dialog-title">${esc(title)}</strong></div><div class="weui_dialog_bd">${body}</div><div class="weui_dialog_ft">${confirm?`<button class="weui_btn_dialog default" data-action="dialog-cancel">${esc(cancelLabel)}</button>`:''}<button class="weui_btn_dialog primary" data-action="dialog-confirm">确定</button></div></div>`;
    $('dialog-root').hidden=false;syncInert();$('dialog-root').querySelector('button').focus({preventScroll:true});
  }
  function closeDialog(){state.dialog=null;$('dialog-root').hidden=true;syncInert();restoreFocus();}
  function showToast(text){clearTimeout(state.toastTimer);$('toast').textContent=text;$('toast').hidden=false;state.toastTimer=setTimeout(()=>$('toast').hidden=true,4000);}
  function openSheet(caption,options){
    rememberFocus();state.sheet=options;
    $('sheet-root').innerHTML=`<button class="source-mask" data-action="sheet-cancel" aria-label="取消"></button><div class="weui_actionsheet" role="dialog" aria-modal="true" aria-label="${esc(caption||'选择操作')}">${caption?`<div class="sheet-caption">${esc(caption)}</div>`:''}<div class="weui_actionsheet_menu">${options.map((o,i)=>`<button class="weui_actionsheet_cell" data-action="sheet-option" data-index="${i}">${esc(o.label)}</button>`).join('')}</div><div class="weui_actionsheet_action"><button class="weui_actionsheet_cell" data-action="sheet-cancel">取消</button></div></div>`;
    $('sheet-root').hidden=false;requestAnimationFrame(()=>$('sheet-root').dataset.state='open');syncInert();$('sheet-root').querySelector('.weui_actionsheet_cell').focus({preventScroll:true});
  }
  async function closeSheet(){state.sheet=null;$('sheet-root').dataset.state='closed';await motionFinished($('sheet-root').querySelector('.weui_actionsheet'));$('sheet-root').hidden=true;syncInert();restoreFocus();}
  function openSecondary(route){
    saveView();state.routes.push(route);
    const url=new URL(location.href);url.hash=`preview/${route.kind}/${route.id||''}`;
    history.pushState({depth:state.routes.length},'',url.href);renderSecondary();
  }
  function renderSecondary(){
    const route=state.routes.at(-1);if(!route)return;
    const o=orderById(route.id);let title='销售单详情',body='';
    if(route.kind==='product'){
      const g=o.items[route.index||0];title='商品预览';body=`<img class="preview-product" src="../assets/image/${esc(g.icon)}" alt="${esc(g.title)}"><div class="detail-fields"><p>${esc(g.title)}</p><p>货号：${esc(g.goodsNum)}</p></div><p class="preview-note">本地图片预览。原入口跳转商品详情，本次未还原独立商品详情页。</p>`;
    } else if(route.kind==='detail'){
      body=`<p class="preview-note">本地订单摘要，供体验列表进入与返回；独立详情页未完整还原。</p>${cardHTML(o,true)}<div class="detail-fields">${[['销售单号',o.id],['客户',o.customer],['电话',o.phone],['来源',o.source],['备注',o.note||'无']].map(([k,v])=>`<div class="detail-field"><span>${k}</span><span>${esc(v)}</span></div>`).join('')}</div><p class="route-note">源码目标：${o.tab==='hold'||o.tab==='refund'?`#order_detail/${esc(o.id)}?path=sales_order&pageType=${o.tab}`:`#/biz/order_detail/${esc(o.id)}?path=sales_order`}</p>`;
    } else {
      title=route.title;
      body=`<p class="preview-note">此入口在原版进入独立业务页面。当前还原销售单列表，以下为跳转预览。</p>${o?cardHTML(o,true):''}<div class="detail-fields"><p>${esc(route.description)}</p></div><p class="route-note">源码目标：${esc(route.target)}</p><p class="preview-note">${esc(route.boundary||'本地演示不会请求真实接口，也不会提交业务操作。')}</p>`;
    }
    $('secondary').innerHTML=`<header class="secondary-header"><button data-action="back" aria-label="返回列表">〈 返回</button><h1>${esc(title)}</h1></header><div class="secondary-body">${body}</div>`;
    $('secondary').hidden=false;$('secondary-scrim').hidden=false;requestAnimationFrame(()=>$('secondary').dataset.state='open');syncInert();$('secondary').querySelector('button').focus({preventScroll:true});
  }
  async function handlePop(event){
    const depth=event.state?.depth||0;
    state.routes=state.routes.slice(0,depth);
    if(state.routes.length){renderSecondary();return;}
    $('secondary').dataset.state='closed';await motionFinished($('secondary'));$('secondary').hidden=true;$('secondary-scrim').hidden=true;syncInert();
    const v=state.views[viewKey()];if(v){$('list-scroll').scrollTop=v.top;$('list-scroll').scrollLeft=v.left;}
    const card=$('orders').querySelector(`[data-id="${state.lastOrder||''}"]`);card?.focus({preventScroll:true});
  }
  function flow(title,target,id,description,boundary){openSecondary({kind:'flow',title,target,id,description,boundary});}
  function mutate(o){
    // 原型能力：固定成功示例替代取消API；真实异步刷新结果由接口决定。
    o.tab='closed';o.statusVal=-1;o.statusTxt='已取消';o.buttons=[['share','分享']];renderList();showToast('已取消本地样例订单');
  }
  function orderAction(action,o,index){
    state.lastOrder=o.id;
    if(action==='order-menu'||action==='hidden-menu'){const buttons=action==='order-menu'?o.buttons:exposedButtons(o).hidden;return openMenu('',buttons.map(([a,label])=>({label,run:()=>orderAction(a,o)})),document.querySelector(`[data-id="${o.id}"] [data-action="${action}"]`),'above');}
    if(action==='customer')return flow('客户详情',`#/fans_info/示例客户`,o.id,'原版根据buyerType及订单类型判断是否可进入客户详情；当前为普通客户样例。');
    if(action==='stock')return flow('库存补货','WgAlbum.MultiStockEdit',o.id,'待收款商品的SKU库存不足或库存不超过10时展示去补货入口；当前库存是演示值。');
    if(action==='invite')return flow('邀Ta付款','WgBiz.OrderShare',o.id,'原版根据订单类型和商家进件状态拉起付款分享。');
    if(action==='holdList')return flow('挂起',`#hold_order/${o.id}`,o.id,'原版进入挂起商品选择或挂起列表，是否可操作取决于服务端按钮。');
    if(action==='returnExchangeList')return openSheet('',[{label:'退款',run:()=>flow('退款',`#refund_order_list/${o.id}`,o.id,'主单进入可退款商品列表。')},{label:'换货',run:()=>flow('换货',`#/order/change_order_select/${o.id}`,o.id,'主单进入换货商品选择页面。')}]);
    if(action==='product')return openSecondary({kind:'product',id:o.id,index:Number(index)});
    if(action==='detail'||action==='edit'||action==='checkSalesOrder')return openSecondary({kind:'detail',id:o.id});
    if(action==='pay')return flow('记收款','checkOfflineReceipt → getPaymentStatus → WgBiz.CollectionStatus',o.id,'preprod先校验线下收款资格，再查询商家进件状态；商家分支打开收款方式面板。','本次仅还原列表入口，不用旧版“确认收款”弹窗代替真实收款方式面板。');
    if(action==='close')return openDialog('确定取消？','取消后订单将失效，且无法恢复，请谨慎操作！',()=>mutate(o),'暂不取消');
    const routes={allocate:['配货',`#/order/distribution/warehouse_select/${o.id}?fromPage=saleList`,'preprod进入配货仓库选择页面，本地仅展示入口。'],delivery:[isPendingPickup(o)?'核销':'发货',`#/order/delivery_storage_list?type=single&orderNo=${o.id}&deliveryType=${o.deliveryMethod==='自提'?2:0}&fromPage=saleList`,'preprod先查询发货信息并校验收件信息，再进入发货仓库/发货单选择页面。'],unhold:['恢复配货',`#recover_order/${o.id}`,'原版进入恢复配货页面，选择需要恢复的挂起商品。'],refundList:['退款',`#refund_order_list/${o.id}`,'原版进入可退款商品列表。'],againOrder:['再来一单',`#again_order/${o.id}/againOrder?path=sales_order`,'preprod先检查商品是否失效，继续后进入再来一单。'],viewLogistics:['查看物流',`#/order/view_logicstics/演示单号`,'整单发货时进入物流页；非整单发货时进入销售单详情。'],share:['分享','WgBiz.OrderShare','preprod按主单、挂起、退款或换货分支打开订单分享面板。本地未调用真实分享。']};
    const r=routes[action];if(r)flow(r[0],r[1],o.id,r[2]);
  }
  function batchExport(){
    const next=status=>flow('批量导出',`#order/batch_export_order?statusVal=${status}`,null,'原版根据筛选条件查询导出入口；权限、会员与是否有订单取决于接口返回。','当前仅体验选择导出范围与页面跳转，不生成真实导出文件。');
    if(state.tab==='all')openSheet('',[{label:'待发货',run:()=>next(1)},{label:'已发货',run:()=>next(3)}]);else next(state.tab==='delivered'?3:1);
  }
  function openMenu(title,options,anchor,placement='below'){
    rememberFocus();state.menu={options};const r=anchor?.getBoundingClientRect()||{left:16,right:196,top:100,bottom:144};
    const width=Math.min(190,innerWidth-24),left=Math.max(12,Math.min(innerWidth-width-12,r.left));
    const maxHeight=Math.min(options.length*44+8,innerHeight-24);
    const top=placement==='above'?Math.max(12,r.top-maxHeight-8):Math.min(innerHeight-maxHeight-12,r.bottom+6);
    $('menu-root').innerHTML=`<button class="menu-mask" data-action="menu-close" aria-label="关闭菜单"></button><div class="menu-panel" role="menu" aria-label="${esc(title||'更多操作')}" style="left:${left}px;top:${top}px;width:${width}px;max-height:${maxHeight}px">${options.map((o,i)=>`<button role="menuitem" data-action="menu-option" data-index="${i}" class="${o.selected?'selected':''}">${esc(o.label)}${o.selected?'<span>✓</span>':''}</button>`).join('')}</div>`;
    $('menu-root').hidden=false;syncInert();$('menu-root').querySelector('[role=menuitem]')?.focus({preventScroll:true});
  }
  function closeMenu(){state.menu=null;$('menu-root').hidden=true;syncInert();restoreFocus();}
  function openSort(anchor){
    const t=state.tab,options=[t!=='hold'?['2','按更新时间']:null,['0','新订单在上'],['1','老订单在上'],t==='pending_delivery'?['3','新付款在上']:null,t==='pending_delivery'?['4','早付款在上']:null].filter(Boolean);
    const current=state.sorts[t]||(t==='hold'?'0':'2');
    openMenu('排序',options.map(([v,label])=>({label,selected:current===v,run:()=>{saveView();state.sorts[t]=v;localStorage.setItem('wego-demo-sales-preprod-sorts',JSON.stringify(state.sorts));fetchList();}})),anchor);
  }
  function toggleSearchTypes(open){
    state.searchTypesOpen=open;$('search-types').hidden=!open;
    if(open){$('search-types').style.top=document.querySelector('.search-toolbar').getBoundingClientRect().bottom+'px';$('search-types').innerHTML=`<button class="search-type-mask" data-action="search-types-close" aria-label="关闭搜索类型"></button><div class="type-list">${searchTypes.map(([v,label])=>`<button data-action="search-type" data-value="${v}"><span>${label}：<b>${esc(state.draftQuery)}</b></span>${state.searchType===v?'<span>✓</span>':''}</button>`).join('')}</div>`;}
    $('list-scroll').inert=open;syncSearch();
  }
  function closeSearchTypes(){toggleSearchTypes(false);}
  $('search-input').addEventListener('focus',()=>{if(state.draftQuery)toggleSearchTypes(true);});
  window.addEventListener('message',e=>{if(e.source!==parent||e.data?.type!=='sales-preview-view'||!['flat','compact'].includes(e.data.view))return;saveView();state.view=e.data.view;const previous=state.views[viewKey()];renderList();if(previous){$('list-scroll').scrollTop=previous.top;$('list-scroll').scrollLeft=previous.left;}saveView();});
  // A/B仅切换名称布局；保留同一内存订单、tab、条件、弹层与滚动，不重载iframe。
  window.addEventListener('message',e=>{
    if(e.source!==parent||e.data?.type!=='sales-preview-pickup'||!['a','b'].includes(e.data.variant)||!comparisonPage)return;
    saveView();state.pickupVariant=e.data.variant;document.body.dataset.pickupVariant=state.pickupVariant;renderList();
    if(state.routes.length){const top=document.querySelector('.secondary-body')?.scrollTop||0;renderSecondary();document.querySelector('.secondary-body').scrollTop=top;}
    saveView();
  });
  window.addEventListener('resize',()=>{if(!state.loading)renderList();});
  // 事件绑定：稳定 data-action；侧栏取消丢弃草稿，重置仅清空草稿，确定才应用。
  document.addEventListener('click',async event=>{
    const el=event.target.closest('[data-action]');
    if(!el){const card=event.target.closest('.order-card');if(card&&!state.routes.length)orderAction('detail',orderById(card.dataset.id));return;}
    const action=el.dataset.action,card=el.closest('[data-id]');
    if(card)return orderAction(action,orderById(card.dataset.id),el.dataset.index);
    if(action==='tab'){if(el.dataset.tab===state.tab&&['all','pending_delivery','delivered','hold'].includes(state.tab))return openSort(el);return changeTab(el.dataset.tab);}
    if(action==='clear-search')return doSearch('');
    if(action==='image-search')return openDialog('以图搜图','原版需校验图搜权限并上传图片。本地预览未接入上传与图片检索服务。');
    if(action==='open-filter')return openFilter();
    if(action==='cancel-filter')return closeFilter();
    if(action==='reset-filter'){state.draftFilter=emptyFilter();return renderFilter();}
    if(action==='filter-option'){const {key,value}=el.dataset;state.draftFilter[key]=state.draftFilter[key]===value?'':value;renderFilter();return;}
    if(action==='apply-filter'){const f={...state.draftFilter},year=365*86400000;let start=f.start?Date.parse(f.start+'T00:00:00Z'):Date.parse('2026-10-22T00:00:00Z'),end=f.end?Date.parse(f.end+'T00:00:00Z'):Date.parse('2026-10-22T00:00:00Z');if(f.start&&end-start>year){showToast('选择时间范围不能超过一年');return;}if(!f.start&&f.end)f.start=new Date(end-year).toISOString().slice(0,10);saveView();state.filter=f;await closeFilter();return fetchList();}
    if(action==='dialog-cancel')return closeDialog();
    if(action==='dialog-confirm'){const run=state.dialog?.confirm;closeDialog();return run?.();}
    if(action==='sheet-cancel')return closeSheet();
    if(action==='sheet-option'){const run=state.sheet?.[Number(el.dataset.index)]?.run;await closeSheet();return run?.();}
    if(action==='back')return history.back();
    if(action==='load-more'){state.limit+=6;renderList();saveView();return;}
    if(action==='retry'){state.pageState='ready';return fetchList();}
    if(action==='batch-export')return batchExport();
    if(action==='batch-print')return flow('打印小票','#order/batch_print_small_bill',null,'原版先检查是否有可打印订单，再进入批量打印小票页面。','本地未连接打印插件、打印机或真实订单。');
    if(action==='batch-delivery')return openSheet('发货方式为本地样例，原选项由接口返回',[{label:'快递',run:()=>flow('批量发货','#/order/delivery_order_list/batch/0',null,'原版根据接口返回的发货方式，进入相应批量发货页。')},{label:'自提',run:()=>flow('批量发货','#/order/delivery_order_list/batch/2',null,'原版根据接口返回的发货方式，进入相应批量发货页。')}]);
    if(action==='menu-close')return closeMenu();
    if(action==='menu-option'){const run=state.menu?.options[Number(el.dataset.index)]?.run;closeMenu();return run?.();}
    if(action==='search-type'){state.searchType=el.dataset.value;return doSearch($('search-input').value);}
    if(action==='search-types-close')return closeSearchTypes();
    if(action==='quick-filter'){saveView();state.quick=String(state.quick)===el.dataset.value?'':el.dataset.value;renderQuick();return fetchList();}
    if(action==='only-matches'){state.onlyMatches=!state.onlyMatches;renderQuick();return renderList();}
    if(action==='clear-filter'){state.filter=emptyFilter();return fetchList();}
    if(action==='batch-more')return openMenu('',[{label:'批量挂起',run:()=>flow('批量挂起','#order/batch_hold_order',null,'preprod批量挂起入口。')},{label:'批量导出',run:batchExport}],el,'above');
    if(action==='batch-prepare')return openMenu('',[{label:'批量备货',run:()=>flow('批量备货','#/stock_order?fromPage=saleList',null,'preprod备货/配货入口，是否显示取决于canAllocate。')},{label:'批量配货',run:()=>flow('批量配货','#/order/distribution/warehouse_select?fromPage=saleList',null,'preprod批量配货入口。')}],el,'above');
    if(action==='batch-recover')return flow('批量恢复配货','#order/batch_recover_order',null,'preprod挂起tab底栏的批量恢复配货入口。');
    if(action==='settings')return flow('销售单设置','#/platform/setting?jumpFrom=sales_order',null,'preprod右上角设置进入开单/销售单设置。');
    if(action==='root-back')return openDialog('本地预览','这是独立销售单预览，未连接原App的上级页面。');
  });
  $('search-form').addEventListener('submit',e=>{e.preventDefault();doSearch($('search-input').value);});
  $('search-input').addEventListener('input',e=>{state.draftQuery=e.target.value.replace(/^\s+/,'');e.target.value=state.draftQuery;toggleSearchTypes(!!state.draftQuery);if(!state.draftQuery&&state.query)doSearch('');});
  $('start-date').addEventListener('change',e=>state.draftFilter.start=e.target.value);
  $('end-date').addEventListener('change',e=>state.draftFilter.end=e.target.value);
  $('list-scroll').addEventListener('scroll',()=>{saveView();autoLoad();},{passive:true});
  window.addEventListener('popstate',handlePop);
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){
      if(state.menu){e.preventDefault();closeMenu();}else if(state.searchTypesOpen){e.preventDefault();closeSearchTypes();}else if(state.dialog){e.preventDefault();closeDialog();}else if(state.sheet){e.preventDefault();closeSheet();}else if(state.filterOpen){e.preventDefault();closeFilter();}else if(state.routes.length){e.preventDefault();history.back();}
    }
    if(e.key==='Tab'){
      const root=state.menu?$('menu-root'):state.dialog?$('dialog-root'):state.sheet?$('sheet-root'):state.filterOpen?$('filter-layer'):state.routes.length?$('secondary'):null;
      if(root){const nodes=[...root.querySelectorAll('button:not(:disabled),input,a[href]')].filter(n=>n.getClientRects().length);const first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}
    }
    const tab=e.target.closest('[role=tab]');
    if(tab&&['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const i=tabs.findIndex(t=>t[0]===state.tab),n=e.key==='Home'?0:e.key==='End'?5:(i+(e.key==='ArrowRight'?1:5))%6;changeTab(tabs[n][0]);$(`tab-${tabs[n][0]}`).focus({preventScroll:true});}
    if(e.key==='Enter'&&e.target.classList.contains('order-card'))orderAction('detail',orderById(e.target.dataset.id));
  });
  history.replaceState({depth:0},'',`${location.pathname}${location.search}#sales_order/${state.tab}`);
  renderTabs();renderSummary();syncSearch();
  if(state.pageState==='empty'){state.visibleIds=[];renderList();}
  else if(['loading','error'].includes(state.pageState))renderList();
  else{state.pageState='ready';fetchList();}
})();
