registrationModule.controller("nodoController",function(e,n,r,o,t,a,i,c){e.isLoading=!1,e.idProceso=1,e.perfil=1;var u=function(e,n,r,t){$("#btnEnviar").button("reset"),o.error("Ocurrio un problema")};e.init=function(){c.get(getParameterByName("employee")).success(d).error(u)};var d=function(e,r,o,a){n.empleado=e,getParameterByName("id")&&t.getHeader(getParameterByName("id"),n.empleado.idUsuario).success(s).error(u)},s=function(r,o,a,i){e.expediente=r,t.getAll(getParameterByName("id"),e.idProceso,n.empleado.idPerfil).success(l).error(u)},l=function(n,r,o,t){e.listaNodos=n,e.numElements=n.length,g(),setTimeout(function(){$("ul#standard").roundabout({btnNext:".next",btnNextCallback:function(){f(".next")},btnPrev:".prev",btnPrevCallback:function(){f(".prev")},clickToFocusCallback:function(){f(".next")}}),p(e.currentPage)},1)},g=function(){e.currentPage=e.expediente.nodoActual},f=function(n){e.currentPage=$("ul#standard").roundabout("getChildInFocus")+1,0!=e.listaNodos[e.currentPage-1].enabled?p(e.currentPage):(o.warning("Nodo "+e.currentPage+" no disponible para su perfil."),$(n).click())};e.setPage=function(n,r){0!=r.enabled?(e.currentPage=n.currentTarget.innerText,p(e.currentPage)):o.warning("Nodo "+e.currentPage+" no disponible para su perfil.")};var p=function(n){$("ul#standard").roundabout("animateToChild",n-1),e.currentNode=e.listaNodos[n-1],P(),b()},P=function(){angular.forEach(e.listaNodos,function(n,r){r==e.currentPage-1?n.active=1:n.active=0}),v()},N=function(n,r,o,t){e.isLoading=!1,e.listaAlertas=n,v()},m=function(n,r,o,t){e.listaDocumentos=n,i.getByNodo(e.idProceso,e.currentNode.id,e.currentNode.folio).success(N).error(u)},b=function(){e.isLoading=!0,v(),a.getByNodo(e.currentNode.id,e.currentNode.folio,e.perfil).success(m).error(u)},v=function(){"$apply"!=e.$root.$$phase&&"$digest"!=e.$root.$$phase&&e.$apply()}});