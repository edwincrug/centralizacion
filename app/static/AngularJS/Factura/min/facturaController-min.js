registrationModule.controller("facturaController",function(e,o,n,r,t,i,a,c){var u=function(e,o,n,t){$("#btnConfirmar").button("reset"),r.error("Ocurrio un problema")};e.init=function(){l(),s(),e.consultaInicial=1,e.respuesta={opcion:"1"}};var l=function(){if(""!=getParameterByName("id")&&(o.currentFolioFactura=getParameterByName("id")),null==o.currentFolioFactura){var e=prompt("Ingrese un folio de orden",1);o.currentFolioFactura=e}},s=function(){if(""!=getParameterByName("employee")&&(o.currentEmployee=getParameterByName("employee")),null==o.currentEmployee){var e=prompt("Ingrese un número de empleado",1);o.currentEmployee=e}c.getDoc(o.currentFolioFactura,o.currentEmployee,20).success(d).error(u)},d=function(n,t,i,a){if(null!=n)if(""!=n)e.documentoIni='<div><object id="ifDocument" data="'+n+'" type="application/pdf" width="100%"><p>Alternative text - include a link <a href="'+n+'">to the PDF!</a></p></object> </div>',c.getDoc(o.currentFolioFactura,o.currentEmployee,15).success(m).error(u),$("#btnSalir").hide();else{r.warning("Aun no se ha subido la Factura de este folio.");var l='<div class="noExiste"><b> El documento aun no esta disponible </b> </div>';$("#divDocumento").append(l),$("#divControles").hide()}else{r.warning("Aun no se ha subido la Factura de este folio.");var l='<div class="noExiste"><b> El documento aun no esta disponible </b> </div>';$("#divDocumento").append(l),$("#divControles").hide()}},m=function(n,r,t,i){if(null!=n&&""!=n){var a=o.obtieneTypeAplication(n);e.documentoIni=e.documentoIni.replace("<div>",'<div class="izquierda">')+' <div class="derecha"><object id="ifDocument2" data="'+n+'" type="'+a+'" width="100%"><p>Error al cargar el documento. Intente de nuevo.</a></p></object></div>',1==e.consultaInicial&&$("#divControles").hide()}$("#divDocumento").append(e.documentoIni)};e.Confirmar=function(){c.getDoc(o.currentFolioFactura,o.currentEmployee,15).success(p).error(u)};var p=function(n,t,i,a){null!=n?""!=n?c.setFactura(o.currentFolioFactura,o.currentEmployee,e.respuesta.opcion).success(f).error(u):r.warning("Debe subir el documento de Recepción de Factura."):r.warning("No existe informacion para este folio.")},f=function(e,n,t,i){null!=e?0==e?(r.success("Confirmación exitosa."),o.cierraVentana()):r.error("Ocurrio un error al guardar. Intente de nuevo"):r.warning("No existe informacion para este folio.")};o.muestraDocumentos=function(){$("#divDocumento").empty(),e.consultaInicial=0,c.getDoc(o.currentFolioFactura,o.currentEmployee,20).success(d).error(u)},o.cierraVentana=function(){r.success("Que tenga buen día"),setTimeout(function(){window.close()},2500)}});