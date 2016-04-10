registrationModule.controller("nodoController",function(e,o,n,a,i,t,r,s){e.isLoading=!1,e.idProceso=1,e.perfil=1;var l=function(e,o,n,i){$("#btnEnviar").button("reset"),a.error("Ocurrio un problema")};e.init=function(){c(),s.get(o.currentEmployee).success(u).error(l)},o.CargaEmpleado=function(n){c(),e.id=n,s.get(o.currentEmployee).success(u).error(l)};var c=function(){$("#lgnUser").val().indexOf("[")>-1?$("#lgnUser").val().indexOf("[")>-1&&!n.get("lgnUser")&&(getParameterByName("employee")?(alert("Inicie sesión desde panel de aplicaciones."),window.close()):o.currentEmployee=getParameterByName("employee")):n.set("lgnUser",$("#lgnUser").val()),o.currentEmployee=n.get("lgnUser")},u=function(n,t,r,s){o.empleado=n,null!=o.empleado?(e.folio=""!=getParameterByName("id")?getParameterByName("id"):e.id,e.folio?i.getHeader(e.folio,o.empleado.idUsuario).success(d).error(l):$("#slide").click()):a.error("El empleado no existe en el sistema.")};e.navegaFolio=function(n){$("#navegaLinks").modal("hide"),1==o.navegacionBusqueda&&1==o.tipoFolio?(e.navBusFolio=1,i.getNavegacion(n,2,3).success(x).error(l),o.navegacionBusqueda=0,o.tipoFolio=0):o.CargaEmpleado(n)};var d=function(n,t,r,s){e.iniciaNodos=0,e.expediente=n,1==e.navBusFolio&&(e.expediente.nodoActual=e.nodNavBusqueda),e.navBusFolio=0,null!=e.expediente?i.getAll(e.folio,e.idProceso,o.empleado.idPerfil).success(g).error(l):a.error("No existe información para este expediente.")};e.VerOrdenPadre=function(e){location.href="/?id="+e.folioPadre},e.VerOrdenHijo=function(e){location.href="/?id="+e.folioHijo};var g=function(o,n,a,i){e.listaNodos=o,e.numElements=o.length,f(),setTimeout(function(){$("ul#standard").roundabout({btnNext:".next",btnNextCallback:function(){v(".next")},btnPrev:".prev",btnPrevCallback:function(){v(".prev")},clickToFocusCallback:function(){v(".next")}}),N(e.currentPage)},1)},f=function(){e.currentPage=e.navDestino>0?e.navDestino:e.expediente.nodoActual,e.navDestino=0},v=function(o){1==e.expediente.esPlanta?p(e.currentPage,$("ul#standard").roundabout("getChildInFocus")+1):(e.currentPage=$("ul#standard").roundabout("getChildInFocus")+1,0!=e.listaNodos[e.currentPage-1].enabled?N(e.currentPage):(a.warning("El nodo "+e.currentPage+" no está disponible para su perfil."),$(o).click()))};e.setPage=function(o){0!=o.enabled?1==e.expediente.esPlanta?p(e.currentPage,o.id):(e.currentPage=o.id,N(e.currentPage)):a.warning("Nodo "+e.currentPage+" no disponible para su perfil.")};var p=function(o,n){var a=global_settings.nodoSaltoRefacciones[0],t=global_settings.nodoSaltoRefacciones[1],r=0,s=0;e.especial=!1,a>o&&n>t&&(r=1,s=2,e.especial=!0),o>t&&a>n&&(r=3,s=2,e.especial=!0),a>o&&n>=a&&t>=n&&(r=1,s=2),o>=a&&t>=o&&n>t&&(r=2,s=3),o>t&&n>=a&&t>=n&&(r=3,s=2),o>=a&&t>=o&&a>n&&(r=2,s=1),e.navDestino=e.especial?0:n,0!=r&&0!=s?i.getNavegacion(e.folio,r,s).success(x).error(l):(e.currentPage=n,N(e.currentPage))};o.navBusqueda=function(n,a,t){var r=n,s=1==n?2:3;o.navegacionBusqueda=1,e.navBusFolio=1,e.folio=t,e.nodNavBusqueda=0,o.tipoFolio=n,1==n&&a>=global_settings.nodoSaltoRefacciones[0]&&(r=1,s=2,e.nodNavBusqueda=global_settings.nodoSaltoRefacciones[0]-1),2==n&&a>global_settings.nodoSaltoRefacciones[1]&&(e.nodNavBusqueda=global_settings.nodoSaltoRefacciones[1],r=2,s=3),i.getNavegacion(t,r,s).success(x).error(l)};var N=function(n){$("ul#standard").roundabout("animateToChild",n-1),e.currentNode=e.listaNodos[n-1],m(),o.LoadActiveNode(),e.iniciaNodos=1},m=function(){angular.forEach(e.listaNodos,function(o,n){n==e.currentPage-1?o.active=1:o.active=0}),B()},P=function(o,n,a,i){e.isLoading=!1,e.listaAlertas=o,B()},b=function(o,n,a,i){e.listaDocumentos=o,r.getByNodo(e.idProceso,e.currentNode.id,e.currentNode.folio).success(P).error(l)};o.LoadActiveNode=function(){1!=e.currentNode.estatus?(e.isLoading=!0,B(),t.getByNodo(e.currentNode.id,e.currentNode.folio,e.perfil).success(b).error(l)):a.warning("El nodo "+e.currentNode.id+" aún no se activa para el expediente actual. No existen documentos para mostrar.")};var B=function(){"$apply"!=e.$root.$$phase&&"$digest"!=e.$root.$$phase&&e.$apply()},x=function(n,i,t,r){if(n.length>0)switch(n[0].tipoFolioNav){case 1:o.tituloNavegacion="OC";break;case 2:o.tituloNavegacion="Remisiones";break;case 3:o.tituloNavegacion="Facturas"}1==e.navBusFolio?n.length>0?(1==o.tipoFolio?(o.linksNavegacion=n,$("#navegaLinks").modal("show")):(o.linksNavegacion=n,setTimeout(function(){$("#navegaLinks").modal("show")},300)),e.navBusFolio=0):o.CargaEmpleado(e.folio):n.length>0?(o.linksNavegacion=n,$("#navegaLinks").modal("show")):0==o.navegacionBusqueda?a.warning("No existen remisiones/facturas para continuar el flujo."):(o.CargaEmpleado(e.folio),o.navegacionBusqueda=0)}});